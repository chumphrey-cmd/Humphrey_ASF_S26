import { useState } from 'react';
import api from '../services/api';
import { useAiSettings } from '../context/AiSettingsContext';

export const useAiTutor = () => {
    const { apiKey, setShowSettingsModal } = useAiSettings();

    // --- State for Static Explanations ---
    const [aiExplanations, setAiExplanations] = useState({});
    const [loadingAiFor, setLoadingAiFor] = useState(null);
    const [aiError, setAiError] = useState(null);

    // --- State for Socratic Chat ---
    // Maps questionId to an array of messages: { 'uuid-123': [{role: 'user', content: '...'}, {role: 'model', content: '...'}] }
    const [chatHistories, setChatHistories] = useState({});
    const [isChatLoadingFor, setIsChatLoadingFor] = useState(null);
    
    const handleExplain = async (questionId) => {
        if (!apiKey) {
            setShowSettingsModal(true);
            return;
        }

        setLoadingAiFor(questionId);
        setAiError(null);

        try {
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

    // --- Socratic Chat Function ---
    const handleSocraticChat = async (questionId, userMessage) => {
        if (!apiKey) {
            setShowSettingsModal(true);
            return;
        }

        const currentHistory = chatHistories[questionId] || [];

        // 1. Frontend Guardrail: Max 10 turns (20 messages total) to protect BYOK tokens
        if (currentHistory.length >= 20) {
            setAiError("Maximum conversation limit reached for this question.");
            return;
        }

        // 2. Format the new message and optimistically add it to the history
        const newMessage = { role: "user", content: userMessage };
        const updatedHistory = [...currentHistory, newMessage];

        setChatHistories(prev => ({
            ...prev,
            [questionId]: updatedHistory
        }));

        setIsChatLoadingFor(questionId);
        setAiError(null);

        try {
            // 3. Send the entire history array to Spring Boot DTO
            const response = await api.post(`/api/questions/${questionId}/chat`, {
                messages: updatedHistory
            });

            // 4. Append the AI's successful response
            const modelReply = { role: "model", content: response.data.reply };

            setChatHistories(prev => ({
                ...prev,
                [questionId]: [...updatedHistory, modelReply]
            }));

        } catch (error) {
            console.error("AI Chat Error:", error);
            if (error.response?.status === 401 || error.response?.status === 400) {
                // Check if the backend sent a specific error message (like token limit reached)
                setAiError(error.response?.data?.error || "Invalid AI Provider or API Key.");
                if (error.response?.status === 401) setShowSettingsModal(true);
            } else {
                setAiError("Failed to fetch tutor response. Please try again.");
            }
        } finally {
            setIsChatLoadingFor(null);
        }
    };

    return {
        // Static Exports
        aiExplanations,
        loadingAiFor,
        aiError,
        handleExplain,
        // Chat Exports
        chatHistories,
        isChatLoadingFor,
        handleSocraticChat
    };
};