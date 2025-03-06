import Survey from "../Survey";
import { retailStoreQuestions } from "../scenarios";

export default function Page() {
    return (
        <>
            <h1>This is human-human</h1>
            <Survey Scenario={retailStoreQuestions} />
        </>
    );
}
