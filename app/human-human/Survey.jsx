"use client";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

export default function MySurvey() {
    const scenarios = [
        "An e-commerce company plans to open a checkout-free retail store. Customers can simply walk in, grab what they need, and go. To achieve that, each store will have cameras nestled in the ceiling to monitor customers' behavior and sensors on the shelves to monitor the item movement. \n\nWrite a few sentences on your opinions on this data practice.",
        "The company develops sophisticated artificial intelligence algorithms to analyze the video footages from the cameras and other sensor readings. These algorithms will use face recognition to identify users, continuously monitor users' movement, and track the items users put in their baskets. \n\nWrite a few sentences on your opinions on this data practice",
        "The company then calculates the total price for all the items in a user's basket and bill the user directly when the user gets out of the store. After deploying such a system, the company can save labor costs and reduce shoplifting loss, and the users no longer need to wait in line. \n\nWrite a few sentences on your opinions on this data practice",
        "Based on the users' purchasing patterns, the retail store builds a profile of each user. The company uses that profile to recommend items to users. For example, a user who purchases grill equipment and steaks online before may receive a notification, \"Hey, we know you love to grill and like steak. We've got a special on ribeyes right now\". \n\nWrite a few sentences on your opinions on this data practice",
        "When the user finishes the shopping, the company will send a receipt to the user through its e-commerce app. The receipt will enumerate the items the user purchased, the time spent in the store and the routes the user moved inside the store. \n\nWrite a few sentences on your opinions on this data practice.",
        "The company plans to offer automated pricing, already used for things like airline tickets, in the local store. A store's AI might see you, a loyal customer, standing in front of the yogurt case or trying on winter coats and offer a 15 percent discount. Or it might charge you more because it knows you're in a rush and live in an affluent zip code. Prices may also fluctuate in real time based on demand, just like ridesharing. \n\nWrite a few sentences on your opinions on this data practice",
    ];

    // Create survey elements for all scenarios
    const createSurveyElements = () => {
        const elements = [];

        scenarios.forEach((scenario, index) => {
            elements.push({
                type: "comment",
                name: `scenarioResponse${index}`,
                title: scenario,
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

    return <Survey model={surveyModel} />;
}
