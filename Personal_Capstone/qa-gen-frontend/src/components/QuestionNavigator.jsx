import React from 'react';

const QuestionNavigator = ({ questions, userAnswers, flagged, jumpToQuestion }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-10 p-6 bg-gray-50 border rounded-lg max-h-96 overflow-y-auto">
            {questions.map((q, idx) => {
                // Determine the state of each question for styling
                const isAnswered = (userAnswers[q.id] || []).length > 0;
                const isFlagged = flagged.has(q.id);

                return (
                    <button
                        key={q.id}
                        onClick={() => jumpToQuestion(idx)}
                        className={`
                            w-12 h-12 rounded shadow-sm font-bold flex items-center justify-center transition text-lg
                            ${isFlagged ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400' :
                            isAnswered ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200' : 'bg-white border-2 border-red-300 text-red-500 hover:bg-red-50'}
                        `}
                    >
                        {isFlagged ? '🚩' : idx + 1}
                    </button>
                );
            })}
        </div>
    );
};

export default QuestionNavigator;