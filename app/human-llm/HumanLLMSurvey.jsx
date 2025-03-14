"use client";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";

import { Survey } from "survey-react-ui";
import { settings } from "survey-core";

settings.lazyRender.enabled = true;

export default function HumanLLMSurvey({ SurveyScenario }) {
    const surveyJson = {
        elements: SurveyScenario.map((question) => {
            return { title: question, type: "comment" };
        }),
    };

    const survey = new Model(surveyJson);

    return <Survey model={survey} />;
}
