import { sql } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
});
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;


export const assistantsTable = sqliteTable('assistants', {
    id: integer('id').primaryKey(),
    domaine: text('domaine').notNull(),
    role: text('role').notNull(),
    nom: text('nom').notNull(),
    description: text('description').notNull(),
    phrase: text('phrase').notNull(),
    image: blob('image').notNull(), // Stocker l'URL de l'image
    theme: text('theme').notNull(),
    // themeBis: text('theme_bis').notNull(),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    modifiedDate: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});
export type InsertAssistant = typeof assistantsTable.$inferInsert;
export type SelectAssistant = typeof assistantsTable.$inferSelect;


export const messagesTable = sqliteTable('messages', {
    id: integer('id').primaryKey(),
    content: text('content').notNull(),
    role: text('role').notNull(),
    threadId: text('thread_id').notNull(),
    userId: integer('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }), // Clé étrangère vers usersTable
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
});
export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;