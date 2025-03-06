"use client";
import { useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

export default function MySurvey() {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [choices, setChoices] = useState(generateChoices());

    const scenarios = [
        "Scenario 1: What would you do in this situation?",
        "Scenario 2: How would you handle this?",
        // Add more scenarios as needed
    ];

    function generateChoices() {
        // Generate random choices for the scenario
        const possibleChoices = [
            "Choice A",
            "Choice B",
            "Choice C",
            "Choice D",
            "Choice E",
            "Choice F",
        ];
        return possibleChoices.sort(() => 0.5 - Math.random()).slice(0, 4); // Randomly select 4 choices
    }

    const surveyJson = {
        pages: [
            {
                name: "scenarioPage",
                elements: [
                    {
                        type: "checkbox",
                        name: "scenarioResponse",
                        title: scenarios[scenarioIndex],
                        choices: choices,
                    },
                    {
                        type: "html",
                        name: "refreshButton",
                        html: `<button id="refreshButton" class="refresh-button">Refresh Choices</button>`,
                    },
                ],
            },
        ],
    };

    const surveyModel = new Model(surveyJson);

    console.log(surveyJson);

    surveyModel.onComplete.add((sender) => {
        console.log("Survey completed!", sender.data);
    });

    surveyModel.onAfterRenderPage.add((sender, options) => {
        const refreshButton = document.getElementById("refreshButton");
        if (refreshButton) {
            refreshButton.onclick = () => {
                setChoices(generateChoices());
                surveyModel.setValue("scenarioResponse", []); // Clear previous selections
                surveyModel.render(); // Re-render the survey to reflect new choices
            };
        }
    });

    return <Survey model={surveyModel} />;
}
