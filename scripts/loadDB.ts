import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";
import { ragSEOData } from "@/assistants/seo/data";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Vérification de l'existence de ASTRA_DB_API_ENDPOINT
if (!ASTRA_DB_API_ENDPOINT) {
    throw new Error("ASTRA_DB_API_ENDPOINT is not defined");
};

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT as string, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
});

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    if (!ASTRA_DB_COLLECTION) {
        throw new Error("ASTRA_DB_COLLECTION is not defined");
    }
    const res = await db.createCollection(ASTRA_DB_COLLECTION as string, {
        vector: {
            dimension: 1536,
            metric: similarityMetric
        }
    });
    console.log(res);
};

const scrapePage = async (url: string): Promise<string> => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML);
            await browser.close();
            return result;
        }
    });
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '');
};

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION as string);
    for await (const url of ragSEOData) {
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
        for await (const chunk of chunks) {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            });

            const vector = embedding.data[0].embedding;

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            });
            console.log(res);
        };
    };
};

createCollection().then(() => loadSampleData());