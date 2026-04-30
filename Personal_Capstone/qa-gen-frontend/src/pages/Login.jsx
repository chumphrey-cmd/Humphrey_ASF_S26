import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
    // 1. State: Variables to hold what the user types and any errors we get back
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 2. Hooks: Bring in our global login function and the React Router navigator
    const { login } = useAuth();
    const navigate = useNavigate();

    // 3. The Submit Handler: Fires when the user clicks "Sign In"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stops the browser from refreshing the page
        setError(''); // Clear any previous errors

        try {
            // Ask Axios to POST the email/password to Spring Boot
            const response = await api.post('/api/auth/login', { email, password });

            // If successful, Spring Boot returns the raw JWT string. We grab it here.
            const token = response.data;

            // Send the token to our AuthContext (which saves it to LocalStorage)
            login(token);

            // Redirect the user to the protected Dashboard
            navigate('/dashboard');
        } catch (err) {
            // If Spring Boot throws a 401 Unauthorized, catch it and show a friendly message
            if (err.response && err.response.status === 401) {
                setError('Invalid email or password.');
            } else {
                setError('Invalid email or password.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

                {/* Visual Error State: Only renders if the 'error' state has text */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}