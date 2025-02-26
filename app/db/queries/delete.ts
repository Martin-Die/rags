import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable, SelectAssistant, assistantsTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
    await db.delete(usersTable).where(eq(usersTable.id, id));
}

export async function deleteAssistant(id: SelectAssistant['id']) {
    await db.delete(assistantsTable).where(eq(assistantsTable.id, id));
}
