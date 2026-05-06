import { useState } from 'react';

export default function QuizConfigModal({ isOpen, onClose, onStart }) {
    // The modal manages its own temporary form state
    const [mode, setMode] = useState('exam');
    const [timeLimit, setTimeLimit] = useState(30); // Default to 30 minutes

    // If the modal isn't supposed to be open, render nothing
    if (!isOpen) return null;

    const handleStartClick = () => {
        // Pass the final configuration back to the parent component
        onStart({
            mode: mode,
            timeLimit: Number(timeLimit) // Ensure it's treated as a number
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Setup</h2>

                {/* Mode Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Mode</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="mode"
                                value="exam"
                                checked={mode === 'exam'}
                                onChange={(e) => setMode(e.target.value)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span>Exam Mode</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="mode"
                                value="study"
                                checked={mode === 'study'}
                                onChange={(e) => setMode(e.target.value)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span>Study Mode</span>
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {mode === 'exam'
                            ? "Test your knowledge. Scores are recorded. No immediate feedback."
                            : "Learn as you go. Instant AI feedback. Scores are not recorded."}
                    </p>
                </div>

                {/* UPDATED: Time Limit Selection (Number Input) */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Time Limit (Minutes)
                    </label>
                    <input
                        type="number"
                        min="0"
                        className="w-full border border-gray-300 rounded p-2 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        disabled={mode === 'study'} // Optional UX: Disable timer input in study mode
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter 0 for no time limit.</p>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleStartClick}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition shadow-md"
                    >
                        Start Engine
                    </button>
                </div>
            </div>
        </div>
    );
}