import React from 'react';

const ResultsScreen = ({ finalScore, onReturnHome }) => {
    return (
        <div className="py-8 text-center bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Exam Complete!</h2>

            <div className="text-6xl mb-6">
                {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '👍' : '📚'}
            </div>

            <p className="text-2xl text-gray-600 mb-8">
                Final Score: <span className="font-bold text-blue-600">{finalScore}%</span>
            </p>

            <button
                onClick={onReturnHome}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
            >
                Return to Dashboard
            </button>
        </div>
    );
};

export default ResultsScreen;