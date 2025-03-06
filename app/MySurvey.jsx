"use client";
import { useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

export default function MySurvey() {
    const scenarios = [
        "Scenario 1: What would you do in this situation?",
        "Scenario 2: How would you handle this?",
        "Scenario 3: what about this?",
        "Scenario 4: and how about this?",
        // Add more scenarios as needed
    ];

    const scenarioPossibleChoices = [
        [
            "Scenario 1 - Choice A",
            "Scenario 1 - Choice B",
            "Scenario 1 - Choice C",
            "Scenario 1 - Choice D",
            "Scenario 1 - Choice E",
            "Scenario 1 - Choice F",
        ],
        [
            "Scenario 2 - Choice A",
            "Scenario 2 - Choice B",
            "Scenario 2 - Choice C",
            "Scenario 2 - Choice D",
            "Scenario 2 - Choice E",
        ],
        [
            "Scenario 3 - Choice A",
            "Scenario 3 - Choice B",
            "Scenario 3 - Choice C",
            "Scenario 3 - Choice D",
            "Scenario 3 - Choice E",
            "Scenario 3 - Choice F",
            "Scenario 3 - Choice G",
        ],
        [
            "Scenario 4 - Choice A",
            "Scenario 4 - Choice B",
            "Scenario 4 - Choice C",
            "Scenario 4 - Choice D",
        ],
    ];

    const [scenarioChoices, setScenarioChoices] = useState(() => {
        return scenarios.map((_, index) => generateChoices(index));
    });

    function generateChoices(scenarioIndex) {
        const possibleChoices = scenarioPossibleChoices[scenarioIndex];
        // Randomly select up to 4 choices (or fewer if not enough choices available)
        const numChoicesToSelect = Math.min(4, possibleChoices.length);
        return possibleChoices
            .sort(() => 0.5 - Math.random())
            .slice(0, numChoicesToSelect);
    }

    // Create survey elements for all scenarios
    const createSurveyElements = () => {
        const elements = [];

        scenarios.forEach((scenario, index) => {
            // Add checkbox question
            elements.push({
                type: "checkbox",
                name: `scenarioResponse${index}`,
                title: scenario,
                choices: scenarioChoices[index],
            });

            // Add refresh button for this scenario
            elements.push({
                type: "html",
                name: `refreshButton${index}`,
                html: `<button id="refreshButton${index}" class="refresh-button">Refresh Choices for Scenario ${
                    index + 1
                }</button>`,
            });
        });

        return elements;
    };

    const surveyJson = {
        pages: [
            {
                name: "scenarioPage",
                elements: createSurveyElements(),
            },
        ],
    };

    const surveyModel = new Model(surveyJson);

    console.log(surveyJson);

    surveyModel.onComplete.add((sender) => {
        console.log("Survey completed!", sender.data);
    });

    surveyModel.onAfterRenderPage.add((sender, options) => {
        scenarios.forEach((scenario, index) => {
            const refreshButton = document.getElementById(
                `refreshButton${index}`
            );
            if (refreshButton) {
                refreshButton.onclick = () => {
                    // Update only the choices for this specific scenario
                    const newChoices = [...scenarioChoices];
                    newChoices[index] = generateChoices(index);
                    setScenarioChoices(newChoices);

                    // Clear previous selections for this scenario
                    surveyModel.setValue(`scenarioResponse${index}`, []);
                };
            }
        });
    });

    return <Survey model={surveyModel} />;
}
