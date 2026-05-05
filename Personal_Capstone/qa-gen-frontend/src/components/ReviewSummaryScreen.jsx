import React from 'react';
import QuestionNavigator from './QuestionNavigator';

const ReviewSummaryScreen = ({
                                 questions,
                                 userAnswers,
                                 flagged,
                                 jumpToQuestion,
                                 onGradeExam,
                                 isSubmitting
                             }) => {
    return (
        <div className="py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Exam Summary</h2>
            <p className="text-center text-gray-600 mb-8">Click any question to review your answer before final submission.</p>

            {/* Nested Component! */}
            <QuestionNavigator
                questions={questions}
                userAnswers={userAnswers}
                flagged={flagged}
                jumpToQuestion={jumpToQuestion}
            />

            <div className="flex justify-center gap-6 text-sm text-gray-600 mb-8">
                <span className="flex items-center gap-2"><div className="w-4 h-4 bg-white border-2 border-red-300 rounded"></div> Unanswered</span>
                <span className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div> Answered</span>
                <span className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded"></div> Flagged</span>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onGradeExam}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition shadow-lg w-full md:w-1/2"
                >
                    {isSubmitting ? 'Grading...' : 'Final Submission: Grade Exam'}
                </button>
            </div>
        </div>
    );
};

export default ReviewSummaryScreen;