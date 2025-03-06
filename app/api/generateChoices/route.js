import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const { scenario, numChoices } = await request.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant that generates realistic scenario responses.",
                },
                {
                    role: "user",
                    content: `For the following scenario, generate ${numChoices} possible responses in a JSON format. The JSON should have a key "choices" that contains an array of ${numChoices} strings, where each string is a possible response to the scenario. Do not include any additional text or explanations.\n\nExample output:\n{\n  "choices": [\n    "Response 1",\n    "Response 2",\n    "Response 3",\n    "Response 4"\n  ]\n}\n\nScenario: ${scenario}`,
                },
            ],
            max_tokens: 500, // Increase max_tokens to accommodate more choices
        });

        const responseText = completion.choices[0].message.content;
        const jsonResponse = JSON.parse(responseText);

        return Response.json(jsonResponse);
    } catch (error) {
        console.error("Error generating choices:", error);
        return Response.json(
            { error: "Failed to generate choices" },
            { status: 500 }
        );
    }
}
