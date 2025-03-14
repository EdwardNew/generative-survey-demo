"use client";
import { useState } from "react";

export default function LLMLLMSurvey({ SurveyScenario }) {
    const [responses, setResponses] = useState({});

    const handleAskGPT = async (question) => {
        try {
            // Make an API call to your ChatGPT route
            const response = await fetch("/api/chatgpt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
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
                    [question]: result,
                }));
            }
        } catch (error) {
            console.error("Error fetching GPT response:", error);
            setResponses((prev) => ({
                ...prev,
                [question]: "Error: Failed to fetch response.",
            }));
        }
    };

    return (
        <div className="space-y-4 max-w-2xl mx-auto p-4">
            {SurveyScenario.map((question, index) => (
                <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
                >
                    <p className="text-lg font-semibold text-gray-900 mb-4">
                        {question}
                    </p>
                    <button
                        onClick={() => handleAskGPT(question)}
                        className="w-full sm:w-auto px-4 py-2 bg-[#19b394] text-white font-semibold rounded-md hover:bg-[#168a73] transition duration-200"
                    >
                        Ask GPT
                    </button>
                    {responses[question] && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {responses[question]}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
