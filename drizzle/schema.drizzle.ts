import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export type UserRole = 'USER' | 'ADMIN';
export type Team = 'Медіа' | 'Управління';
export type Provider = 'google' | 'github' | 'credentials';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);
export const teamEnum = pgEnum('team', ['Медіа', 'Управління']);
export const providerEnum = pgEnum('provider', [
  'google',
  'github',
  'credentials',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  imageUrl: text('image_url').notNull(),
  role: userRoleEnum('role').notNull(),
  team: teamEnum('team').notNull(),
  telegramLink: text('telegram_link').notNull(),
  instagramLink: text('instagram_link').notNull(),
  description: text('description').notNull(),
  provider: providerEnum('provider').notNull(),
});
