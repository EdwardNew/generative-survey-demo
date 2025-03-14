import { OpenAI } from "openai";
import { concerns } from "@/app/concerns";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    const { scenario, numChoices } = await request.json();

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `Generate ${numChoices} distinct multiple-choice options based on the following scenario: ${scenario}. Each option should align with one of these privacy concerns: ${concerns}. 
        
        Write from a first-person perspective, making each option feel personal. Ensure the options are specific to the scenario and provide a concrete example of how it could lead to that privacy concern. 
        
        Do **not** include the privacy concern labels, number prefixes, or bullet points. Instead, craft each response as a standalone statement under 50 words. Be imaginative in extrapolating potential privacy risks from the scenario.`,
                },
            ],
        });

        const choices = response.choices[0].message.content
            .split("\n")
            .filter((line) => line.trim())
            .slice(0, numChoices);

        return new Response(JSON.stringify({ choices }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error generating choices:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate choices" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
