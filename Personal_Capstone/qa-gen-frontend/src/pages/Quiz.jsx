import {useEffect, useState} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { useQuizData } from "../hooks/useQuizData.js";
import { useAiTutor } from '../hooks/useAiTutor.js';
import { useQuizEngine } from "../hooks/useQuizEngine.js";

import ExamFooterActions from "../components/ExamFooterActions.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import AiSettingsModal from "../components/AiSettingsModal.jsx";
import ReviewSummaryScreen from "../components/ReviewSummaryScreen.jsx";
import QuestionNavigator from "../components/QuestionNavigator.jsx";
import QuizHeader from "../components/QuizHeader.jsx";
import ResultsScreen from "../components/ResultsScreen.jsx";

export default function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Route State Catching for Timer!
    const location = useLocation();

    // Safely extract the config. If someone types the URL directly, fallback to defaults.
    const config = location.state || { mode: 'exam', timeLimit: 0 };

    // Initialize our settings based on the modal
    const [examMode, setExamMode] = useState(config.mode);
    const [timeLimit, setTimeLimit] = useState(config.timeLimit);

    // Convert minutes to seconds for the countdown timer
    const [timeLeft, setTimeLeft] = useState(config.timeLimit * 60);

    // --- Timer Logic ---
    useEffect(() => {
        // Stop the clock if: no time limit exists, the exam is graded, or we are in review mode
        if (timeLimit === 0 || isGraded || isReviewing) return;

        // Auto-submit when the clock hits zero
        if (timeLeft <= 0) {
            handleGradeExam();
            return;
        }

        // Tick down every 1 second
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        // Cleanup function to prevent memory leaks
        return () => clearInterval(timerId);
    }, [timeLeft, timeLimit, isGraded, isReviewing, handleGradeExam]);

    // Helper function to turn '90' seconds into '01:30' for the UI
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Data Fetching Logic - /hooks
    const { quiz, questions, isLoading, error } = useQuizData(id);

    // Ai Tutor Logic - /hooks
    const {
        apiKey,
        setApiKey,
        showApiKeyModal,
        setShowApiKeyModal,
        aiExplanations,
        loadingAiFor,
        aiError,
        handleExplain,
        saveApiKey
    } = useAiTutor();

    // Quiz Engine Logic - /hooks
    const {
        currentIndex, setCurrentIndex, userAnswers, flagged,
        isGraded, isReviewing, setIsReviewing, finalScore, isSubmitting,
        jumpToQuestion, handleOptionSelect, toggleFlag, handleGradeExam
    } = useQuizEngine(id, questions, examMode);

    // UI Elements
    if (isLoading) return <div className="min-h-screen bg-gray-100 p-8 text-center text-xl font-bold">Loading Arena...</div>;
    if (error) return <div className="min-h-screen bg-gray-100 p-8 text-center text-red-600 font-bold">{error}</div>;
    if (questions.length === 0) return <div className="min-h-screen bg-gray-100 p-8 text-center font-bold">No questions found.</div>;

    // Progress percentage logic
    const progressPercent = examMode === 'exam'
        ? ((currentIndex + 1) / questions.length) * 100
        : (Object.keys(userAnswers).length / questions.length) * 100;

    const answeredCount = Object.keys(userAnswers).filter(id => userAnswers[id].length > 0).length;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">

                {/* --- EXTRACTED HEADER & PROGRESS BAR --- */}
                <QuizHeader
                    title={quiz.title}
                    examMode={examMode}
                    // Notice we deleted setExamMode={setExamMode} here!
                    timeLeft={timeLimit > 0 ? formatTime(timeLeft) : null} // Passing our formatted time
                    currentIndex={currentIndex}
                    totalQuestions={questions.length}
                    answeredCount={Object.keys(userAnswers).length}
                    isGraded={isGraded}
                    progressPercent={(Object.keys(userAnswers).length / questions.length) * 100}
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
                            <ExamFooterActions
                                examMode={examMode}
                                currentIndex={currentIndex}
                                totalQuestions={questions.length}
                                onPrevious={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                onNext={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                onReview={() => setIsReviewing(true)}
                            />

                        </div>
                    )
                ) : (
                    /* Results Screen */
                    <ResultsScreen
                        finalScore={finalScore}
                        onReturnHome={() => navigate('/dashboard')}
                    />
                )}

                {/*  AI BYOK Settings Modal */}
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