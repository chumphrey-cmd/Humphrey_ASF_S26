import { useState } from 'react';
import api from '../services/api';
import { useAiSettings } from '../context/AiSettingsContext';

export const useAiTutor = () => {
    const { apiKey, setShowSettingsModal } = useAiSettings();

    const [aiExplanations, setAiExplanations] = useState({});
    const [loadingAiFor, setLoadingAiFor] = useState(null);
    const [aiError, setAiError] = useState(null);

    const handleExplain = async (questionId) => {
        // If no key is in context, pop open the global settings modal!
        if (!apiKey) {
            setShowSettingsModal(true);
            return;
        }

        setLoadingAiFor(questionId);
        setAiError(null);

        try {
            // Interceptor handles the headers automatically
            const response = await api.get(`/api/questions/${questionId}/explain`);

            setAiExplanations(prev => ({
                ...prev,
                [questionId]: response.data.explanation
            }));

        } catch (error) {
            console.error("AI Error:", error);
            if (error.response?.status === 401 || error.response?.status === 400) {
                setAiError("Invalid AI Provider or API Key. Please check your settings.");
                setShowSettingsModal(true); // Open global modal on auth failure
            } else {
                setAiError("Failed to fetch explanation. Please try again.");
            }
        } finally {
            setLoadingAiFor(null);
        }
    };

    // Return ONLY what the UI needs to render the explanations
    return {
        aiExplanations,
        loadingAiFor,
        aiError,
        handleExplain
    };
};