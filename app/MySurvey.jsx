"use client";
import { useState, useEffect } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

export default function MySurvey() {
    const scenarios = [
        "An e-commerce company plans to open a checkout-free retail store. Customers can simply walk in, grab what they need, and go. To achieve that, each store will have cameras nestled in the ceiling to monitor customers' behavior and sensors on the shelves to monitor the item movement. \nSelect the statement(s) that most aligns with your opinions about this data practice.",
        "The company develops sophisticated artificial intelligence algorithms to analyze the video footages from the cameras and other sensor readings. These algorithms will use face recognition to identify users, continuously monitor users' movement, and track the items users put in their baskets. \nSelect the statement(s) that most aligns with your opinions about this data practice.",
        "The company then calculates the total price for all the items in a user's basket and bill the user directly when the user gets out of the store. After deploying such a system, the company can save labor costs and reduce shoplifting loss, and the users no longer need to wait in line. \nSelect the statement(s) that most aligns with your opinions about this data practice.",
        "Based on the users' purchasing patterns, the retail store builds a profile of each user. The company uses that profile to recommend items to users. For example, a user who purchases grill equipment and steaks online before may receive a notification, \"Hey, we know you love to grill and like steak. We've got a special on ribeyes right now\". \nSelect the statement(s) that most aligns with your opinions about this data practice.",
        "When the user finishes the shopping, the company will send a receipt to the user through its e-commerce app. The receipt will enumerate the items the user purchased, the time spent in the store and the routes the user moved inside the store. \nSelect the statement(s) that most aligns with your opinions about this data practice.",
        "The company plans to offer automated pricing, already used for things like airline tickets, in the local store. A store's AI might see you, a loyal customer, standing in front of the yogurt case or trying on winter coats and offer a 15 percent discount. Or it might charge you more because it knows you're in a rush and live in an affluent zip code. Prices may also fluctuate in real time based on demand, just like ridesharing. \nSelect the statement(s) that most aligns with your opinions about this data practice.",
    ];

    const [allScenarioChoices, setAllScenarioChoices] = useState([]); // Store all 14 choices for each scenario
    const [displayedScenarioChoices, setDisplayedScenarioChoices] = useState(
        []
    ); // Store the currently displayed 4 choices
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all choices for each scenario on load
    useEffect(() => {
        const fetchAllChoices = async () => {
            try {
                const choices = await Promise.all(
                    scenarios.map(async (scenario) => {
                        const response = await fetch("/api/generateChoices", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ scenario, numChoices: 14 }), // Request 14 choices
                        });
                        if (!response.ok) {
                            throw new Error("Failed to fetch choices");
                        }
                        const data = await response.json();
                        return data.choices;
                    })
                );
                setAllScenarioChoices(choices); // Store all 14 choices
                setDisplayedScenarioChoices(
                    choices.map((choices) => choices.slice(0, 4))
                ); // Display the first 4 choices initially
                setLoading(false);
            } catch (error) {
                console.error("Error fetching choices:", error);
                setError("Failed to load choices. Please try again later.");
                setLoading(false);
            }
        };

        fetchAllChoices();
    }, []);

    // Function to refresh choices for a specific scenario
    const refreshChoices = (index) => {
        const allChoices = allScenarioChoices[index];
        const displayedChoices = displayedScenarioChoices[index];

        // Filter out the already displayed choices
        const remainingChoices = allChoices.filter(
            (choice) => !displayedChoices.includes(choice)
        );

        // Randomly select 4 new choices from the remaining ones
        const newChoices = remainingChoices
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        // Update the displayed choices for this scenario
        const newDisplayedChoices = [...displayedScenarioChoices];
        newDisplayedChoices[index] = newChoices;
        setDisplayedScenarioChoices(newDisplayedChoices);

        // Clear previous selections for this scenario
        surveyModel.setValue(`scenarioResponse${index}`, []);
    };

    // Create survey elements for all scenarios
    const createSurveyElements = () => {
        const elements = [];

        scenarios.forEach((scenario, index) => {
            elements.push({
                type: "panel",
                name: `scenarioResponse${index}`,
                elements: [
                    {
                        type: "checkbox",
                        name: `scenarioResponse${index}`,
                        title: scenario,
                        choices: displayedScenarioChoices[index] || [],
                    },
                    {
                        type: "html",
                        name: `refreshButton${index}`,
                        html: `<button id="refreshButton${index}" class="refresh-button">Refresh Choices</button>`,
                    },
                ],
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

    surveyModel.onComplete.add((sender) => {
        console.log("Survey completed!", sender.data);
    });

    surveyModel.onAfterRenderPage.add((sender, options) => {
        scenarios.forEach((scenario, index) => {
            const refreshButton = document.getElementById(
                `refreshButton${index}`
            );
            if (refreshButton) {
                refreshButton.onclick = () => refreshChoices(index);
            }
        });
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <Survey model={surveyModel} />;
}
