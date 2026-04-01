import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['CLIENT', 'ADMIN']);
export const providerEnum = pgEnum('provider', [
  'google',
  'github',
  'credentials',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  password: text('password').notNull(),
  fullName: text('full_name'),
  role: userRoleEnum('role').default('CLIENT'),
  provider: providerEnum('provider'),
  providerId: text('provider_id'),
});
