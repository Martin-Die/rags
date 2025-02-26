import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectAssistant, assistantsTable } from '../schema';

export async function updatePost(id: SelectAssistant['id'], data: Partial<Omit<SelectAssistant, 'id'>>) {
    await db.update(assistantsTable).set(data).where(eq(assistantsTable.id, id));
}
