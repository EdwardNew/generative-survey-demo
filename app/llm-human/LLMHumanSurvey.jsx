"use client";
import { useState, useEffect } from "react";

export default function CustomSurvey({ SurveyScenario }) {
    const [allScenarioChoices, setAllScenarioChoices] = useState([]);
    const [displayedScenarioChoices, setDisplayedScenarioChoices] = useState(
        []
    );
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState({});
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setLoading(true);
        setAllScenarioChoices(Array(SurveyScenario.length).fill([]));
        setDisplayedScenarioChoices(Array(SurveyScenario.length).fill([]));

        SurveyScenario.forEach(async (scenario, index) => {
            try {
                const response = await fetch("/api/llm-human", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ scenario, numChoices: 14 }),
                });

                if (!response.ok) throw new Error("Failed to fetch choices");

                const data = await response.json();
                setAllScenarioChoices((prev) => {
                    const newChoices = [...prev];
                    newChoices[index] = data.choices;
                    return newChoices;
                });

                setDisplayedScenarioChoices((prev) => {
                    const newDisplayed = [...prev];
                    newDisplayed[index] = data.choices.slice(0, 4);
                    return newDisplayed;
                });
            } catch (error) {
                console.error("Error fetching choices:", error);
                setError("Failed to load choices. Please try again later.");
            } finally {
                setLoading(false);
            }
        });
    }, []);

    const regenerateChoices = (index) => {
        setRegenerating((prev) => ({ ...prev, [index]: true }));

        setTimeout(() => {
            setDisplayedScenarioChoices((prev) => {
                const allChoices = allScenarioChoices[index];
                let remainingChoices = allChoices.filter(
                    (choice) => !prev[index].includes(choice)
                );
                if (remainingChoices.length === 0)
                    remainingChoices = allChoices;

                const newChoices = remainingChoices
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);

                return prev.map((choices, i) =>
                    i === index ? newChoices : choices
                );
            });

            setRegenerating((prev) => ({ ...prev, [index]: false }));
        }, 300);
    };

    const handleSubmit = () => setSubmitted(true);

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                {error}
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-900">
                Your choices have been submitted. Thank you!
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            {loading ? (
                <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                    <p className="text-lg font-medium text-gray-700">
                        Generating responses...
                    </p>
                    <svg
                        className="animate-spin h-12 w-12 text-[#19b394]"
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
                </div>
            ) : (
                SurveyScenario.map((scenario, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
                    >
                        <p className="text-lg font-semibold text-gray-900 mb-4">
                            {scenario}
                        </p>
                        <div className="space-y-2">
                            {displayedScenarioChoices[index]?.map(
                                (choice, choiceIndex) => (
                                    <label
                                        key={choiceIndex}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-[#19b394] rounded focus:ring-[#19b394]"
                                        />
                                        <span className="text-gray-700">
                                            {choice}
                                        </span>
                                    </label>
                                )
                            )}
                        </div>
                        <button
                            onClick={() => regenerateChoices(index)}
                            disabled={regenerating[index]}
                            className="mt-4 px-4 py-2 bg-[#19b394] text-white font-semibold rounded-md hover:bg-[#168a73] transition duration-200 flex items-center justify-center"
                        >
                            {regenerating[index] ? (
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
                                    Regenerating...
                                </>
                            ) : (
                                "Regenerate Choices"
                            )}
                        </button>
                    </div>
                ))
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-[#19b394] text-white font-semibold rounded-md hover:bg-[#168a73] transition duration-200"
                >
                    Submit Choices
                </button>
            </div>
        </div>
    );
}
