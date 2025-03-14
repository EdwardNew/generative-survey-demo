import { OpenAI } from "openai";
import { concerns } from "@/app/concerns";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    const { text, question } = await request.json();

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `Given this scenario: "${question}", and the following privacy concerns: ${concerns}, analyze this response: "${text}" and determine which privacy concerns are present in the response.  
        
        If the response does not provide sufficient detail or relevant content, return: "No privacy concerns identified due to insufficient information."  
        
        If privacy concerns are present, list them in the format:  
        [Concern]: "[Relevant text snippet]"
        
        Do **not** infer concerns if there is no clear supporting evidence in the response.`,
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
