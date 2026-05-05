import React from 'react';

const QuestionCard = ({
                          q,
                          examMode,
                          currentSelections,
                          isFlagged,
                          isAiLoading,
                          aiExplanation,
                          onOptionSelect,
                          onToggleFlag,
                          onExplain
                      }) => {
    // Calculate if it's a multi-select question for this specific card
    const isMulti = q.correctAnswers.length > 1;

    return (
        <div id={`question-${q.id}`} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl text-gray-800 font-medium">
                    {q.questionNumber}. {q.questionText}
                </h2>
                <button
                    onClick={() => onToggleFlag(q.id)}
                    className={`ml-4 p-2 rounded transition ${isFlagged ? 'bg-yellow-100 text-yellow-700 font-bold' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    🚩 {isFlagged ? 'Flagged' : 'Flag'}
                </button>
            </div>

            {isMulti && <p className="text-sm text-gray-500 mb-4 italic">(Select all that apply)</p>}

            <div className="space-y-3 mb-4">
                {q.options.map((option, idx) => (
                    <label
                        key={idx}
                        className={`block p-4 border rounded cursor-pointer transition 
                            ${currentSelections.includes(option) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <input
                            type={isMulti ? "checkbox" : "radio"}
                            name={`question-${q.id}`}
                            value={option}
                            checked={currentSelections.includes(option)}
                            onChange={() => onOptionSelect(q.id, option, isMulti)}
                            className="mr-3 cursor-pointer"
                        />
                        {option}
                    </label>
                ))}
            </div>

            {/* AI Explain Button & Result (Study Mode Only) */}
            {examMode === 'study' && (
                <div className="border-t pt-4 mt-4">
                    {!aiExplanation ? (
                        <button
                            onClick={() => onExplain(q.id)}
                            disabled={isAiLoading}
                            className="px-4 py-2 border border-purple-500 text-purple-600 font-semibold rounded hover:bg-purple-50 transition text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {isAiLoading ? '✨ Analyzing...' : '✨ Explain with AI'}
                        </button>
                    ) : (
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-5 mt-2">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-purple-800 flex items-center gap-2">✨ AI Explanation</h4>
                            </div>

                            {/* whitespace-pre-wrap ensures the Markdown newlines render cleanly */}
                            <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                {aiExplanation}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;