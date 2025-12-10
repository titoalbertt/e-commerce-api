import { uuid, text, pgTable } from 'drizzle-orm/pg-core';
import { USER_ROLE } from './db.type';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull().default(USER_ROLE.USER),
});

// Type Definitions
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
