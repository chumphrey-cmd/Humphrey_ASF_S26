import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AiSettingsModal from './components/AiSettingsModal';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import Quiz from './pages/Quiz';

function App() {
    /**
     * STATE UPLIFTING:
     * We define these states here in App.jsx because Navbar needs to trigger the modal,
     * and the Modal needs to be visible over every page (Dashboard, Quiz, etc.).
     */
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Sync local component state with Session Storage so the UI reflects saved values
    const [aiProvider, setAiProvider] = useState(sessionStorage.getItem('ai_provider') || 'gemini');
    const [apiKey, setApiKey] = useState(sessionStorage.getItem('ai_api_key') || '');

    /**
     * GLOBAL SAVE HANDLER:
     * This function is passed to the Modal. When the user clicks "Save",
     * it updates both the browser memory (sessionStorage) and the React state.
     */
    const handleSaveAiSettings = (provider, key) => {
        // 1. Persistence: Save to session so it survives a page refresh
        sessionStorage.setItem('ai_provider', provider);
        sessionStorage.setItem('ai_api_key', key);

        // 2. React Update: Update state so all components re-render with new values
        setAiProvider(provider);
        setApiKey(key);

        // 3. Close the modal
        setShowSettingsModal(false);
    };

    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar onOpenAiSettings={() => setShowSettingsModal(true)} />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/create" element={
                        <ProtectedRoute>
                            <CreateQuiz />
                        </ProtectedRoute>
                    } />

                    <Route path="/quiz/:id" element={
                        <ProtectedRoute>
                            <Quiz />
                        </ProtectedRoute>
                    } />
                </Routes>

                <AiSettingsModal
                    showModal={showSettingsModal}
                    currentProvider={aiProvider}
                    currentApiKey={apiKey}
                    onCancel={() => setShowSettingsModal(false)}
                    onSave={handleSaveAiSettings}
                />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;