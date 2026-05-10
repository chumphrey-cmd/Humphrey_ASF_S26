import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const QuestionCard = ({
                          q,
                          displayNumber,
                          examMode,
                          currentSelections = [],
                          isFlagged,
                          isAiLoading,
                          aiExplanation,
                          onOptionSelect,
                          onToggleFlag,
                          onExplain,
                          chatHistory = [],
                          isChatLoading = false,
                          onSendChatMessage
                      }) => {
    // Calculate if it's a multi-select question for this specific card
    const isMulti = q.correctAnswers.length > 1;

    // Removes any leading numbers and periods (e.g., "1. What is..." becomes "What is...")
    const cleanQuestionText = q.questionText.replace(/^\d+\.\s*/, '');

    // NEW STATE: Toggle for the Socratic Chat
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading) return;

        onSendChatMessage(q.id, chatInput);
        setChatInput(""); // Clear input after sending
    };

    return (
        <div id={`question-${q.id}`} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Top Question Header */}
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl text-gray-800 font-medium">
                    {displayNumber}. {cleanQuestionText}
                </h2>
                <button
                    onClick={() => onToggleFlag(q.id)}
                    className={`ml-4 p-2 rounded transition ${isFlagged ? 'bg-yellow-100 text-yellow-700 font-bold' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    🚩 {isFlagged ? 'Flagged' : 'Flag'}
                </button>
            </div>

            {isMulti && <p className="text-sm text-gray-500 mb-4 italic">(Select all that apply)</p>}

            {/* RESTORED: The Multiple Choice Options! */}
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

            {/* AI Explain Button & Result (Phase 7) */}
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

                            {/* Replaced standard text with ReactMarkdown */}
                            <div className="text-gray-800 text-sm leading-relaxed prose prose-purple max-w-none">
                                <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                            </div>

                            {/* Phase 8: Discuss Further Toggle */}
                            <div className="mt-4 pt-4 border-t border-purple-200">
                                <button
                                    onClick={() => setIsChatOpen(!isChatOpen)}
                                    className="text-purple-700 text-sm font-semibold hover:underline"
                                >
                                    {isChatOpen ? 'Hide Discussion' : '💬 Discuss Further'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Phase 8: The Socratic Chat Interface */}
            {isChatOpen && aiExplanation && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col h-80">

                    {/* Chat History Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                    msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm prose prose-sm max-w-none'
                                }`}>
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Floating Dots Loading Indicator */}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-4 rounded-lg rounded-bl-none shadow-sm flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input Box */}
                    <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
                        <form onSubmit={handleChatSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                disabled={isChatLoading}
                                placeholder="Ask a follow-up question..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                            />
                            <button
                                type="submit"
                                disabled={isChatLoading || !chatInput.trim()}
                                className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;