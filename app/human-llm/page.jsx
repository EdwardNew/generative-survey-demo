import Survey from "../MySurvey";
import { retailStoreQuestions } from "../scenarios";

export default function Page() {
    return (
        <>
            <h1>This is human-llm</h1>
            <Survey Scenario={retailStoreQuestions} />
        </>
    );
}
