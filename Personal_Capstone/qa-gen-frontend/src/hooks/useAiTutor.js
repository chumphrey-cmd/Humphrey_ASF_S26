import { useState } from 'react';
import api from '../services/api';

export const useAiTutor = () => {
    // We now track both the key and the provider in state
    const [aiProvider, setAiProvider] = useState(sessionStorage.getItem('ai_provider') || 'gemini');
    const [apiKey, setApiKey] = useState(sessionStorage.getItem('ai_api_key') || '');

    // Renamed for clarity since it will now hold provider AND key settings
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const [aiExplanations, setAiExplanations] = useState({});
    const [loadingAiFor, setLoadingAiFor] = useState(null);
    const [aiError, setAiError] = useState(null);

    const handleExplain = async (questionId) => {
        if (!apiKey) {
            setShowSettingsModal(true);
            return;
        }

        setLoadingAiFor(questionId);
        setAiError(null);

        try {
            // We use a relative path (baseURL is handled by Axios) and NO manual headers.
            // The api.js interceptor automatically catches this and injects the headers.
            const response = await api.get(`/api/questions/${questionId}/explain`);

            setAiExplanations(prev => ({
                ...prev,
                [questionId]: response.data.explanation
            }));

        } catch (error) {
            console.error("AI Error:", error);
            if (error.response?.status === 401 || error.response?.status === 400) {
                setAiError("Invalid AI Provider or API Key. Please check your settings.");
                setShowSettingsModal(true);
            } else {
                setAiError("Failed to fetch explanation. Please try again.");
            }
        } finally {
            setLoadingAiFor(null);
        }
    };

    // Updated to handle both provider and key
    const saveAiSettings = (provider, key) => {
        setAiProvider(provider);
        setApiKey(key);

        sessionStorage.setItem('ai_provider', provider);
        sessionStorage.setItem('ai_api_key', key);

        // Clean up the old gemini-specific key from the user's browser if it exists
        sessionStorage.removeItem('gemini_api_key');

        setShowSettingsModal(false);
        setAiError(null);
    };

    return {
        aiProvider,
        apiKey,
        showSettingsModal,
        setShowSettingsModal,
        aiExplanations,
        loadingAiFor,
        aiError,
        handleExplain,
        saveAiSettings
    };
};