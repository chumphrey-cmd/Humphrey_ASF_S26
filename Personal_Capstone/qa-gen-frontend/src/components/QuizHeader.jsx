import React from 'react';

const QuizHeader = ({
                        title,
                        examMode,
                        setExamMode,
                        currentIndex,
                        totalQuestions,
                        answeredCount,
                        isGraded,
                        progressPercent
                    }) => {
    return (
        <div className="mb-6">
            {/* 1. Header Row: Title & Dropdown */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    {title || "Assessment"}
                </h1>

                {/* Only show the dropdown if the exam hasn't been graded yet */}
                {!isGraded && (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                        <label className="text-sm font-semibold text-gray-600">Mode:</label>
                        <select
                            value={examMode}
                            onChange={(e) => setExamMode(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            <option value="exam">Exam Mode</option>
                            <option value="study">Study Mode</option>
                        </select>
                    </div>
                )}
            </div>

            {/* 2. Progress Bar Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">
                        {isGraded ? 'Final Review' : `Question ${currentIndex + 1} of ${totalQuestions}`}
                    </span>
                    <span className="font-medium">
                        {answeredCount} of {totalQuestions} Answered
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{width: `${progressPercent}%`}}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default QuizHeader;