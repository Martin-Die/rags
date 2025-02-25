import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "./schema"

config({ path: '.env' });

const url = process.env.TURSO_CONNECTION_URL as string;
const authToken = process.env.TURSO_AUTH_TOKEN as string;

if (!url || !authToken) {
    throw new Error('TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN must be provided in the environment variables');
}

const client = createClient({
    url,
    authToken,
});

export const db = drizzle(client, { schema });
