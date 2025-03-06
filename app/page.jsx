import Survey from "./Survey";
import { retailStoreQuestions } from "./scenarios";

export default function Home() {
    return <Survey Scenario={retailStoreQuestions} />;
}
