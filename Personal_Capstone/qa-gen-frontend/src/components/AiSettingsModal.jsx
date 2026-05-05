import React from 'react';

const AiSettingsModal = ({
                             showModal,
                             apiKey,
                             setApiKey,
                             aiError,
                             onCancel,
                             onSave
                         }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    ✨ AI Study Settings
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    To use the AI Explanation feature, please provide your Google Gemini API key.
                    This key is stored securely in your browser's session memory and is completely wiped when you close the tab.
                </p>

                {aiError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded">
                        {aiError}
                    </div>
                )}

                <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(apiKey)}
                        className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700"
                    >
                        Save Key
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiSettingsModal;