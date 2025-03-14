import { retailStoreQuestions } from "../scenarios";
import HumanLLMSurvey from "./HumanLLMSurvey";
import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Human-LLM Demo
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Ask Chat-GPT to label your privacy concerns!
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                        Back
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4">
                <HumanLLMSurvey SurveyScenario={retailStoreQuestions} />
            </main>
        </div>
    );
}
