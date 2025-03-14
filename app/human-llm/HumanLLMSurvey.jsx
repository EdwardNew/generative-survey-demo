"use client";
import { useState } from "react";

export default function HumanLLMSurvey({ SurveyScenario }) {
    const [responses, setResponses] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [loading, setLoading] = useState({}); // Track loading state for each question

    const handleInputChange = (id, value) => {
        setInputValues((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAskGPT = async (id, question) => {
        const inputValue = inputValues[id]?.trim();

        // Validate if the textbox is empty
        if (!inputValue) {
            alert("Please enter some text before submitting.");
            return;
        }

        // Set loading state for this question
        setLoading((prev) => ({
            ...prev,
            [id]: true,
        }));

        try {
            // Make an API call to your ChatGPT route
            const response = await fetch("/api/human-llm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: inputValue, question: question }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            // Read the streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode and update the response
                result += decoder.decode(value, { stream: true });
                setResponses((prev) => ({
                    ...prev,
                    [id]: result,
                }));
            }
        } catch (error) {
            console.error("Error fetching GPT response:", error);
            setResponses((prev) => ({
                ...prev,
                [id]: "Error: Failed to fetch response.",
            }));
        } finally {
            // Reset loading state for this question
            setLoading((prev) => ({
                ...prev,
                [id]: false,
            }));
        }
    };

    return (
        <div className="space-y-4 max-w-2xl mx-auto p-4">
            {SurveyScenario.map((question, index) => {
                const id = `question-${index}`; // Generate a unique ID for each question
                return (
                    <div
                        key={id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
                    >
                        <p className="text-lg font-semibold text-gray-900 mb-4">
                            {question}
                        </p>
                        <textarea
                            value={inputValues[id] || ""}
                            onChange={(e) =>
                                handleInputChange(id, e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#19b394] focus:border-transparent"
                            rows={4}
                            placeholder="Enter your response..."
                        />
                        <button
                            onClick={() => handleAskGPT(id, question)}
                            disabled={loading[id]} // Disable button while loading
                            className="mt-4 px-4 py-2 bg-[#19b394] text-white font-semibold rounded-md hover:bg-[#168a73] transition duration-200 flex items-center justify-center"
                        >
                            {loading[id] ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                "Label Privacy Concerns"
                            )}
                        </button>
                        {responses[id] && (
                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {responses[id]}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
