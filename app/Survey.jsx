"use client";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";

import { Survey } from "survey-react-ui";

export default function SurveyComponent({ Scenario }) {
    const surveyJson = {
        elements: Scenario.map((question) => {
            return { title: question, type: "comment" };
        }),
    };

    const survey = new Model(surveyJson);

    return <Survey model={survey} />;
}
