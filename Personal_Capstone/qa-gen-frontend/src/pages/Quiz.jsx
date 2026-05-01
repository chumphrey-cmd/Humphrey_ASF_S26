// src/pages/Quiz.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Helper: Fisher-Yates Shuffler
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Machine
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [flagged, setFlagged] = useState(new Set());
    const [examMode, setExamMode] = useState('exam');

    // Grader State
    const [isGraded, setIsGraded] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. The Fetcher (Same as Step 1)
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await api.get(`/api/quizzes/${id}`);
                const fetchedQuiz = response.data;

                const preppedQuestions = fetchedQuiz.questions.map(q => {
                    const prefixRegex = /^[A-Z]\.\s*/;
                    const cleanOptions = q.options.map(opt => opt.replace(prefixRegex, ''));
                    const cleanCorrect = q.correctAnswers.map(ans => ans.replace(prefixRegex, ''));

                    return {
                        ...q,
                        options: shuffleArray(cleanOptions),
                        correctAnswers: cleanCorrect
                    };
                });

                setQuiz(fetchedQuiz);
                setQuestions(preppedQuestions);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load quiz.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    // 2. Input Handlers
    const handleOptionSelect = (option, isMulti) => {
        if (isGraded) return; // Lock inputs if already graded

        const currentQId = questions[currentIndex].id;

        setUserAnswers(prev => {
            const currentSelections = prev[currentQId] || [];
            if (isMulti) {
                // Toggle Checkbox logic
                if (currentSelections.includes(option)) {
                    return { ...prev, [currentQId]: currentSelections.filter(o => o !== option) };
                } else {
                    return { ...prev, [currentQId]: [...currentSelections, option] };
                }
            } else {
                // Radio logic
                return { ...prev, [currentQId]: [option] };
            }
        });
    };

    const toggleFlag = () => {
        const currentQId = questions[currentIndex].id;
        setFlagged(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQId)) newSet.delete(currentQId);
            else newSet.add(currentQId);
            return newSet;
        });
    };

    // 3. The Grader & Transporter
    const handleGradeExam = async () => {
        setIsSubmitting(true);
        let correctCount = 0;

        questions.forEach(q => {
            const selected = userAnswers[q.id] || [];
            const correct = q.correctAnswers;

            // Arrays must be exactly the same length and contain the exact same strings
            const isCorrect = selected.length === correct.length &&
                selected.every(val => correct.includes(val));

            if (isCorrect) correctCount++;
        });

        const calculatedScore = Math.round((correctCount / questions.length) * 100);
        setFinalScore(calculatedScore);
        setIsGraded(true);

        try {
            // Fire PUT request to update the score in the database
            await api.put(`/api/quizzes/${id}/score`, { lastScore: calculatedScore });
        } catch (err) {
            console.error("Failed to save score:", err);
            alert("Score calculated locally, but failed to save to database.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-gray-100 p-8 text-center text-xl font-bold">Loading Arena...</div>;
    if (error) return <div className="min-h-screen bg-gray-100 p-8 text-center text-red-600 font-bold">{error}</div>;
    if (questions.length === 0) return <div className="min-h-screen bg-gray-100 p-8 text-center font-bold">No questions found.</div>;

    // Derived State for Current Render
    const currentQ = questions[currentIndex];
    const isMulti = currentQ.correctAnswers.length > 1;
    const currentSelections = userAnswers[currentQ.id] || [];
    const isFlagged = flagged.has(currentQ.id);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                    <div className="flex space-x-4 items-center">
                        <select
                            value={examMode}
                            onChange={(e) => setExamMode(e.target.value)}
                            disabled={isGraded}
                            className="border rounded p-1 text-sm font-mono bg-blue-50 text-blue-800"
                        >
                            <option value="exam">EXAM MODE</option>
                            <option value="study">STUDY MODE</option>
                        </select>
                        <span className="font-bold text-gray-600">
                            Q: {currentIndex + 1} / {questions.length}
                        </span>
                    </div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="w-full bg-gray-200 h-2 rounded mb-6">
                    <div
                        className="bg-blue-600 h-2 rounded transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* Question UI */}
                {!isGraded ? (
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl text-gray-800 font-medium">
                                {currentQ.questionNumber}. {currentQ.questionText}
                            </h2>
                            <button
                                onClick={toggleFlag}
                                className={`ml-4 p-2 rounded transition ${isFlagged ? 'bg-yellow-100 text-yellow-700 font-bold' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                🚩 {isFlagged ? 'Flagged' : 'Flag'}
                            </button>
                        </div>

                        {isMulti && <p className="text-sm text-gray-500 mb-4 italic">(Select all that apply)</p>}

                        <div className="space-y-3 mb-8">
                            {currentQ.options.map((option, idx) => (
                                <label
                                    key={idx}
                                    className={`block p-4 border rounded cursor-pointer transition 
                                        ${currentSelections.includes(option) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <input
                                        type={isMulti ? "checkbox" : "radio"}
                                        name={`question-${currentQ.id}`}
                                        value={option}
                                        checked={currentSelections.includes(option)}
                                        onChange={() => handleOptionSelect(option, isMulti)}
                                        className="mr-3 cursor-pointer"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>

                        {/* Navigation & Actions */}
                        <div className="flex justify-between border-t pt-4">
                            <div className="space-x-3">
                                <button
                                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentIndex === 0}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                    disabled={currentIndex === questions.length - 1}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>

                            <div className="space-x-3">
                                {/* DUMMY AI BUTTON FOR PHASE 5B */}
                                {examMode === 'study' && (
                                    <button
                                        onClick={() => console.log("AI Explanation coming in Phase 5B!")}
                                        className="px-4 py-2 border border-purple-500 text-purple-600 rounded hover:bg-purple-50 transition"
                                    >
                                        ✨ Explain
                                    </button>
                                )}

                                {/* Submit / Grade Button */}
                                {currentIndex === questions.length - 1 && (
                                    <button
                                        onClick={handleGradeExam}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
                                    >
                                        {isSubmitting ? 'Grading...' : 'Submit Exam'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Results Screen */
                    <div className="text-center py-10">
                        <h2 className="text-3xl font-bold mb-4">Exam Complete!</h2>
                        <div className="text-6xl font-black text-blue-600 mb-6">{finalScore}%</div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-gray-800 text-white font-bold rounded hover:bg-gray-900 transition"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}