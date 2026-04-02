import { InferSelectModel } from 'drizzle-orm';
import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['CLIENT', 'ADMIN']);
export type UserRole = InferSelectModel<typeof users>['role'];
export const providerEnum = pgEnum('provider', [
  'google',
  'github',
  'credentials',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  password: text('password'),
  fullName: text('full_name'),
  image: text('image'),
  role: userRoleEnum('role').default('CLIENT'),
  provider: providerEnum('provider'),
  providerId: text('provider_id'),
});

export const team = pgTable('team', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').unique().notNull(),
  role: text('role').notNull(),
  imageSrc: text('image_src').notNull(),
});
