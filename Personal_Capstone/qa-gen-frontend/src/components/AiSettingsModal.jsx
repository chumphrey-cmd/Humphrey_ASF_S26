import React, { useState, useEffect } from 'react';
import {useAiSettings} from "../context/AiSettingsContext.jsx";

const AiSettingsModal = () => {

    const {
        showSettingsModal,
        setShowSettingsModal,
        aiProvider,
        apiKey: globalApiKey,
        saveSettings
    } = useAiSettings();

    const [provider, setProvider] = useState('gemini');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        if (showSettingsModal) {
            setProvider(aiProvider || 'gemini');
            setApiKey(globalApiKey || '');
        }
    }, [showSettingsModal, aiProvider, globalApiKey]);

    if (!showSettingsModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    ✨ AI Study Settings
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Select your preferred AI Provider and enter your API key.
                    This key is securely stored in your browser's session and is wiped when you close the tab.
                </p>

                {/* Provider Selection Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">AI Provider</label>
                    <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                        <option value="gemini">Google Gemini</option>
                        <option value="openai">OpenAI</option>
                    </select>
                </div>

                {/* API Key Input */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">API Key</label>
                    <input
                        type="password"
                        placeholder={provider === 'openai' ? 'sk-proj-...' : 'AIzaSy...'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowSettingsModal(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => saveSettings(provider, apiKey)}
                        className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition shadow-sm"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiSettingsModal;