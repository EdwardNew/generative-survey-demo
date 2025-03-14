export default function SurveyPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Generative Survey Demo
            </h1>
            <div className="flex flex-col space-y-4">
                <a
                    href="/human-llm"
                    className="px-6 py-3 bg-blue-500 text-white text-center font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Human-LLM
                </a>
                <a
                    href="/llm-human"
                    className="px-6 py-3 bg-purple-500 text-white text-center font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    LLM-Human
                </a>
                <a
                    href="/llm-llm"
                    className="px-6 py-3 bg-green-500 text-white text-center font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    LLM-LLM
                </a>
            </div>
        </div>
    );
}
