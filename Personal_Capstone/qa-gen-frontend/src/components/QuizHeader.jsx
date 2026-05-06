import React from 'react';

const QuizHeader = ({
                        title,
                        examMode,
                        timeLeft,
                        currentIndex,
                        totalQuestions,
                        answeredCount,
                        isGraded,
                        progressPercent
                    }) => {
    return (
        <div className="mb-6">
            {/* 1. Header Row: Title & Status Badges */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    {title || "Assessment"}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                    {/* NEW: The Countdown Timer Badge */}
                    {/* Only renders if a time limit was set AND the exam isn't over */}
                    {timeLeft && !isGraded && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 font-mono font-bold text-xl shadow-sm tracking-widest">
                            ⏱️ {timeLeft}
                        </div>
                    )}

                    {/* Locked Mode Badge (Replaced the Dropdown) */}
                    <div className={`px-4 py-2 rounded-lg border shadow-sm font-bold text-sm uppercase tracking-wider
                        ${examMode === 'exam'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-green-50 text-green-700 border-green-200'}`}
                    >
                        {examMode} MODE
                    </div>
                </div>
            </div>

            {/* 2. Progress Bar Section (Unchanged) */}
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