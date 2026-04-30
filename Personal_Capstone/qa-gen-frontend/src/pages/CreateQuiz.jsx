import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { parseAndMapQuestions } from '../utils/parser';

export default function CreateQuiz() {
    // 1. State Management
    const [title, setTitle] = useState('');          // Holds the quiz title
    const [rawText, setRawText] = useState('');      // Holds the massive block of pasted text
    const [errors, setErrors] = useState([]);        // Holds the array of errors from our parser
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevents spam-clicking the save button

    const navigate = useNavigate();

    // 2. The Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset our errors and lock the button
        setErrors([]);
        setIsSubmitting(true);

        try {
            // STEP A: Pass the raw text to our pure function
            const parseResult = parseAndMapQuestions(rawText);

            // STEP B: Check if the parser found formatting errors
            if (!parseResult.success) {
                // If it failed, dump the errors into React state to show the user, then stop execution
                setErrors(parseResult.errors);
                setIsSubmitting(false);
                return;
            }

            // STEP C: Construct the exact payload Spring Boot expects (CreateQuizRequestDTO)
            const payload = {
                title: title,
                questions: parseResult.data
            };

            // STEP D: Fire it off to the backend using our Axios interceptor
            console.log("PAYLOAD SENDING TO BACKEND:", JSON.stringify(payload, null, 2));
            await api.post('/api/quizzes', payload);

            // STEP E: If successful, kick them back to the Dashboard
            navigate('/dashboard');

        } catch (err) {
            // This catches server errors (e.g., Spring Boot rejects it, database is down)
            console.error("Failed to save quiz to database:", err);
            setErrors(["Failed to connect to the server or save the quiz."]);
        } finally {
            // Always unlock the button when finished
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">

                <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Quiz</h1>

                {/* 3. The Error Display Box */}
                {/* Only renders if our errors array has items inside it */}
                {errors.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <h3 className="text-red-800 font-bold mb-2">Formatting Errors Found:</h3>
                        <ul className="list-disc pl-5 text-red-700 space-y-1">
                            {/* Loop through the array and render a bullet point for each error */}
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. The Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title Input */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Quiz Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Chapter 4: Geography"
                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Raw Text Area */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Paste Quiz Text</label>
                        <p className="text-sm text-gray-500 mb-2">
                            Format: "1. Question text" followed by "A. Option", indicating the correct answer with an asterisk (*).
                        </p>
                        <textarea
                            required
                            rows="15"
                            placeholder="1. What is the capital of France?&#10;A. Berlin&#10;B. Madrid&#10;C. Paris*&#10;D. Rome"
                            className="w-full border border-gray-300 p-3 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded text-white font-bold transition duration-200 
                            ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? 'Parsing & Saving...' : 'Save Quiz'}
                    </button>
                </form>

            </div>
        </div>
    );
}