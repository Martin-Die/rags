import OpenAI from "openai";
import { openai } from '@ai-sdk/openai';
import { streamText } from "ai";
// import { LanguageModelV1, streamText } from 'ai';
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openAi = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT as string, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages?.length - 1]?.content;

        let docContext = "";

        const embedding = await openAi.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float",
        });

        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION as string)
            const cursor = collection.find({}, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10
            });

            const documents = await cursor.toArray();
            const docsMap = documents?.map(doc => doc.text);
            docContext = JSON.stringify(docsMap)
        }
        catch (err) {
            console.log("Error querying db...");
            docContext = "";
        };

        const template = {
            role: "system",
            content: `Vous êtes un assistant expert en SEO. Le contexte vous fournira les données les plus récentes de Wikipedia. Si le contexte ne contient pas les informations dont vous avez besoin, répondez en vous basant sur vos connaissances. Formatez les réponses en utilisant Markdown lorsque c'est applicable et ne retournez pas d'images.
            --------------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            --------------------
            QUESTION: ${latestMessage}
            --------------------
            `
        };

        const response = streamText({
            model: openai('gpt-4o'),
            system: 'You are a helpful assistant.',
            messages: [template, ...messages],
        });

        return response.toDataStreamResponse();

    } catch (err) {
        throw err;
    }
};