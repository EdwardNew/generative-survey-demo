import { OpenAI } from "openai";
import { concerns } from "@/app/concerns";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    const { question } = await request.json();

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `given this scenario ${question}, and this list of privacy concerns ${concerns}, list which privacy conerns people might have and why as a bulleted list. Respond in the first person, be succinct, and be opinionated. Give examples of possible scenarios what would cause the privacy concern.`,
                },
            ],
            stream: true,
        });

        // Create a streaming response
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    controller.enqueue(new TextEncoder().encode(content));
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        console.error("Error calling ChatGPT API:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch response" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
