// src/pages/Quiz.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from "../components/QuestionCard.jsx";
import AiSettingsModal from "../components/AiSettingsModal.jsx";
import ReviewSummaryScreen from "../components/ReviewSummaryScreen.jsx";
import QuestionNavigator from "../components/QuestionNavigator.jsx";
import QuizHeader from "../components/QuizHeader.jsx";
import ResultsScreen from "../components/ResultsScreen.jsx";

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
    const [showNavigator, setShowNavigator] = useState(false);
    const [examMode, setExamMode] = useState('exam');

    // Grader State
    const [isGraded, setIsGraded] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI Integration State
    const [apiKey, setApiKey] = useState(sessionStorage.getItem('gemini_api_key') || '');
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [aiExplanations, setAiExplanations] = useState({}); // Stores explanations by question ID
    const [loadingAiFor, setLoadingAiFor] = useState(null); // Tracks which question is currently loading
    const [aiError, setAiError] = useState(null);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Input Handlers accepts 'questionId' directly from the mapped item
    const handleOptionSelect = (questionId, option, isMulti) => {
        if (isGraded) return; // Lock inputs if already graded

        setUserAnswers(prev => {
            const currentSelections = prev[questionId] || [];
            if (isMulti) {
                // Toggle Checkbox logic
                if (currentSelections.includes(option)) {
                    return { ...prev, [questionId]: currentSelections.filter(o => o !== option) };
                } else {
                    return { ...prev, [questionId]: [...currentSelections, option] };
                }
            } else {
                // Radio logic
                return { ...prev, [questionId]: [option] };
            }
        });
    };

    // accepts 'questionId' directly from the mapped item
    const toggleFlag = (questionId) => {
        setFlagged(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) newSet.delete(questionId);
            else newSet.add(questionId);
            return newSet;
        });
    };

    const jumpToQuestion = (index) => {
        setIsReviewing(false);

        if (examMode === 'exam') {
            setCurrentIndex(index); // Just change the index for Exam Mode
        } else {
            // Study Mode maps everything, so we smooth-scroll to the specific div ID
            const qId = questions[index].id;
            const element = document.getElementById(`question-${qId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        setShowNavigator(false); // Auto-close the navigator after clicking
    };

    // Handle the AI Explanation Request
    const handleExplain = async (questionId) => {
        if (!apiKey) {
            setShowApiKeyModal(true);
            return;
        }

        setLoadingAiFor(questionId);
        setAiError(null);

        try {
            const response = await api.get(`http://localhost:8080/api/questions/${questionId}/explain`, {
                headers: {
                    'X-API-Key': apiKey // BYOK Header
                }
            });

            // Save the response to our state dictionary so it persists if the user navigates away and comes back
            setAiExplanations(prev => ({
                ...prev,
                [questionId]: response.data.explanation
            }));

        } catch (error) {
            console.error("AI Error:", error);
            if (error.response?.status === 401) {
                setAiError("Invalid API Key. Please check your settings.");
                setShowApiKeyModal(true); // Pop the modal back open so they can fix it
            } else {
                setAiError("Failed to fetch explanation. Please try again.");
            }
        } finally {
            setLoadingAiFor(null);
        }
    };

    // Save the key strictly to session storage
    const saveApiKey = (key) => {
        setApiKey(key);
        sessionStorage.setItem('gemini_api_key', key);
        setShowApiKeyModal(false);
        setAiError(null);
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

    // Progress percentage logic...
    const progressPercent = examMode === 'exam'
        ? ((currentIndex + 1) / questions.length) * 100
        : (Object.keys(userAnswers).length / questions.length) * 100;

    const answeredCount = Object.keys(userAnswers).filter(id => userAnswers[id].length > 0).length;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">

                {/* --- EXTRACTED HEADER & PROGRESS BAR --- */}
                <QuizHeader
                    title={quiz?.title}
                    examMode={examMode}
                    setExamMode={setExamMode}
                    currentIndex={currentIndex}
                    totalQuestions={questions.length}
                    answeredCount={answeredCount}
                    isGraded={isGraded}
                    progressPercent={progressPercent}
                />

                {/* --- THE TOGGLEABLE NAVIGATOR PANEL --- */}
                <div className="mb-4">
                    <button
                        onClick={() => setShowNavigator(!showNavigator)}
                        className="text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center transition"
                    >
                        {showNavigator ? '▼ Hide Question Navigator' : '▶ Show Question Navigator & Flagged'}
                    </button>

                    {showNavigator && (
                        <div className="mt-4">
                            <QuestionNavigator
                                questions={questions}
                                userAnswers={userAnswers}
                                flagged={flagged}
                                jumpToQuestion={(idx) => {
                                    jumpToQuestion(idx);
                                    // To hide navigator after clicking
                                    setShowNavigator(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Question UI & Review Screen */}
                {!isGraded ? (
                    isReviewing ? (
                        /* --- EXTRACTED REVIEW SUMMARY SCREEN --- */
                        <ReviewSummaryScreen
                            questions={questions}
                            userAnswers={userAnswers}
                            flagged={flagged}
                            jumpToQuestion={jumpToQuestion}
                            onGradeExam={handleGradeExam}
                            isSubmitting={isSubmitting}
                        />
                    ) : (

                        /*
                        * --- THE STANDARD QUESTION RENDERER ---
                        * Handles question card, AI explanation, exam vs multiple choice setup...
                        */

                        <div>

                            <div className={examMode === 'study' ? "space-y-8 h-[60vh] overflow-y-auto pr-4 mb-6" : "mb-6"}>
                                {(examMode === 'exam' ? [questions[currentIndex]] : questions).map((q) => {
                                    return (
                                        <QuestionCard
                                            key={q.id}
                                            q={q}
                                            examMode={examMode}
                                            currentSelections={userAnswers[q.id] || []}
                                            isFlagged={flagged.has(q.id)}
                                            isAiLoading={loadingAiFor === q.id}
                                            aiExplanation={aiExplanations[q.id]}
                                            onOptionSelect={handleOptionSelect}
                                            onToggleFlag={toggleFlag}
                                            onExplain={handleExplain}
                                        />
                                    );
                                })}
                            </div>

                            {/* Navigation & Submission Actions */}
                            <div className="flex justify-between items-center border-t pt-4">

                                {/* Next/Prev buttons ONLY show in Exam Mode */}
                                {examMode === 'exam' ? (
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
                                ) : (
                                    <div>{/* Empty placeholder to keep Submit button pushed right */}</div>
                                )}

                                {/* Submit Button NOW GOES TO REVIEW SUMMARY */}
                                {(examMode === 'study' || currentIndex === questions.length - 1) && (
                                    <button
                                        onClick={() => setIsReviewing(true)}
                                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition shadow-md"
                                    >
                                        Review Summary
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    /* Results Screen */
                    <ResultsScreen
                        finalScore={finalScore}
                        onReturnHome={() => navigate('/dashboard')}
                    />
                )}

                {/* --- EXTRACTED AI BYOK Settings Modal --- */}
                <AiSettingsModal
                    showModal={showApiKeyModal}
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    aiError={aiError}
                    onCancel={() => setShowApiKeyModal(false)}
                    onSave={saveApiKey}
                />

            </div>

        </div>
    );

}