import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {useAiSettings} from "../context/AiSettingsContext.jsx";

// Added onOpenAiSettings prop to trigger the modal from anywhere
export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout(); // Wipes session entirely and redirects back to log in screen.
        navigate('/login');
    };

    const { setShowSettingsModal } = useAiSettings();

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center max-w-5xl">

                <Link to="/dashboard" className="text-xl font-bold tracking-wider hover:text-gray-300 transition">
                    QA-GEN
                </Link>

                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="hover:text-gray-300 transition font-medium">
                        Dashboard
                    </Link>
                    <Link to="/create" className="hover:text-gray-300 transition font-medium">
                        Create Quiz
                    </Link>

                    {/* AI Settings Trigger Button */}
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="flex items-center gap-2 hover:text-gray-300 transition font-medium"
                        title="Configure AI Tutor Settings"
                    >
                        AI Settings
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold shadow transition ml-4"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    );
}