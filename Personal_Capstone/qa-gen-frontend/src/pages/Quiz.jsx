import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    } = useQuizEngine(id, questions);

    // UI display toggles
    const [showNavigator, setShowNavigator] = useState(false);
    const [examMode, setExamMode] = useState('exam');

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