import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']): Promise<
    Array<{
        id: number;
        name: string;
        email: string;
    }>
> {
    return db.select().from(usersTable).where(eq(usersTable.id, id));
}