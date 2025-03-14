import { retailStoreQuestions } from "../scenarios";
import LLMLLMSurvey from "./LLMLLMSurvey";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        LLM-LLM Demo
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Ask Chat-GPT to label its own privacy concerns!
                    </p>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4">
                <LLMLLMSurvey SurveyScenario={retailStoreQuestions} />
            </main>
        </div>
    );
}
