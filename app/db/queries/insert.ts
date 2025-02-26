import { db } from '../index';
import { InsertUser, usersTable, InsertAssistant, assistantsTable } from '../schema';

export async function createUser(data: InsertUser) {
    await db.insert(usersTable).values(data);
}

export async function createAssistant(data: InsertAssistant) {
    await db.insert(assistantsTable).values(data);
}
