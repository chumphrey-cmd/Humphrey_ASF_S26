import { useState } from 'react';
import api from '../services/api';

export const useAiTutor = () => {
    const [apiKey, setApiKey] = useState(sessionStorage.getItem('gemini_api_key') || '');
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [aiExplanations, setAiExplanations] = useState({});
    const [loadingAiFor, setLoadingAiFor] = useState(null);
    const [aiError, setAiError] = useState(null);

    const handleExplain = async (questionId) => {
        if (!apiKey) {
            setShowApiKeyModal(true);
            return;
        }

        setLoadingAiFor(questionId);
        setAiError(null);

        try {
            const response = await api.get(`http://localhost:8080/api/questions/${questionId}/explain`, {
                headers: {
                    'X-API-Key': apiKey
                }
            });

            setAiExplanations(prev => ({
                ...prev,
                [questionId]: response.data.explanation
            }));

        } catch (error) {
            console.error("AI Error:", error);
            if (error.response?.status === 401) {
                setAiError("Invalid API Key. Please check your settings.");
                setShowApiKeyModal(true);
            } else {
                setAiError("Failed to fetch explanation. Please try again.");
            }
        } finally {
            setLoadingAiFor(null);
        }
    };

    const saveApiKey = (key) => {
        setApiKey(key);
        sessionStorage.setItem('gemini_api_key', key);
        setShowApiKeyModal(false);
        setAiError(null);
    };

    return {
        apiKey,
        setApiKey,
        showApiKeyModal,
        setShowApiKeyModal,
        aiExplanations,
        loadingAiFor,
        aiError,
        handleExplain,
        saveApiKey
    };
};