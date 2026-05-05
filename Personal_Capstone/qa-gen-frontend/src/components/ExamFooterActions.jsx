import React from 'react';

const ExamFooterActions = ({
                               examMode,
                               currentIndex,
                               totalQuestions,
                               onPrevious,
                               onNext,
                               onReview
                           }) => {
    return (
        <div className="flex justify-between items-center border-t pt-4">
            {/* Next/Prev buttons ONLY show in Exam Mode */}
            {examMode === 'exam' ? (
                <div className="space-x-3">
                    <button
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={onNext}
                        disabled={currentIndex === totalQuestions - 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            ) : (
                <div>{/* Empty placeholder to keep Submit button pushed right */}</div>
            )}

            {/* Submit Button NOW GOES TO REVIEW SUMMARY */}
            {(examMode === 'study' || currentIndex === totalQuestions - 1) && (
                <button
                    onClick={onReview}
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition shadow-md"
                >
                    Review Summary
                </button>
            )}
        </div>
    );
};

export default ExamFooterActions;