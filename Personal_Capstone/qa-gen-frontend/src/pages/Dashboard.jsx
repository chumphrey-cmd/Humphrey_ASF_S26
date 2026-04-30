import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
    // 1. State Management
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // 2. Fetch Data on Mount
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // Hits the updated QuizController endpoint we just fixed
                const response = await api.get('/api/quizzes');
                setQuizzes(response.data);
            } catch (err) {
                console.error("Error fetching quizzes:", err);
                setError("Failed to load your quizzes. Please try again later.");
            } finally {
                setIsLoading(false); // Turn off the loading spinner
            }
        };

        fetchQuizzes();
    }, []); // Empty dependency array means this runs exactly once when the page loads

    // 3. UI Renders
    if (isLoading) {
        return <div className="min-h-screen bg-gray-100 p-8 flex justify-center"><p className="text-xl">Loading your quizzes...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Quizzes</h1>
                    <Link
                        to="/create"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        + Create New Quiz
                    </Link>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!error && quizzes.length === 0 && (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <h2 className="text-xl text-gray-600 mb-4">You haven't created any quizzes yet.</h2>
                        <Link to="/create" className="text-blue-600 font-bold hover:underline">
                            Click here to parse your first quiz!
                        </Link>
                    </div>
                )}

                {/* The Quiz Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={quiz.title}>
                                {quiz.title}
                            </h3>

                            <div className="text-sm text-gray-500 mb-4">
                                Last Score: <span className="font-bold text-gray-700">{quiz.lastScore !== null ? `${quiz.lastScore}%` : 'Not taken yet'}</span>
                            </div>

                            <button
                                onClick={() => navigate(`/quiz/${quiz.id}`)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                            >
                                Take Quiz
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}