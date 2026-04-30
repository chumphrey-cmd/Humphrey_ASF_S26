import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    // Bring in our global state and the logout function we wrote earlier
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // The Bouncer for the Navbar: Hide it completely if they aren't logged in
    if (!isAuthenticated) return null;

    // The Escape Hatch Execution
    const handleLogout = () => {
        logout();             // Wipes the token from LocalStorage and State
        navigate('/login');   // Kicks the user back to the login screen
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center max-w-5xl">

                {/* Brand / Logo */}
                <Link to="/dashboard" className="text-xl font-bold tracking-wider hover:text-gray-300 transition">
                    QA-GEN
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="hover:text-gray-300 transition">
                        Dashboard
                    </Link>
                    <Link to="/create" className="hover:text-gray-300 transition">
                        Create Quiz
                    </Link>

                    {/* The Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold shadow transition"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    );
}