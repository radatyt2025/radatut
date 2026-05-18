import { relations } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export type UserRole = 'USER' | 'ADMIN';
export type Team = 'Правління' | 'Медіа' | 'Волонтерська' | 'Проєктна';
export type Provider = 'credentials';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);
export const teamEnum = pgEnum('team', [
  'Правління',
  'Медіа',
  'Волонтерська',
  'Проєктна',
]);
export const providerEnum = pgEnum('provider', ['credentials']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  imageUrl: text('image_url').notNull(),
  role: userRoleEnum('role').notNull(),
  position: text('position').notNull().default('помічник'),
  team: teamEnum('team').notNull().default('Проєктна'),
  telegramLink: text('telegram_link').notNull(),
  instagramLink: text('instagram_link').notNull(),
  description: text('description').notNull(),
  provider: providerEnum('provider').notNull(),
});

export const elections = pgTable('elections', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const candidates = pgTable('candidates', {
  id: uuid('id').primaryKey().defaultRandom(),
  electionId: uuid('election_id')
    .references(() => elections.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').default('/images/default.png').notNull(),
  link: text('link').default('#').notNull(),
});

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  electionId: uuid('election_id')
    .references(() => elections.id, { onDelete: 'cascade' })
    .notNull(),
  candidateId: uuid('candidate_id')
    .references(() => candidates.id, { onDelete: 'cascade' })
    .notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  studentId: text('student_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const electionsRelations = relations(elections, ({ many }) => ({
  candidates: many(candidates),
  votes: many(votes),
}));

export const candidatesRelations = relations(candidates, ({ one }) => ({
  election: one(elections, {
    fields: [candidates.electionId],
    references: [elections.id],
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  election: one(elections, {
    fields: [votes.electionId],
    references: [elections.id],
  }),
  candidate: one(candidates, {
    fields: [votes.candidateId],
    references: [candidates.id],
  }),
}));

export const validStudentTickets = pgTable('valid_student_tickets', {
  ticketNumber: text('ticket_number').primaryKey(),
});

export const eventTypeEnum = pgEnum('event_type', ['INTERNAL', 'EXTERNAL']);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  type: eventTypeEnum('type').default('INTERNAL').notNull(),
  link: text('link'),
  buttonName: text('button_name').default('Зареєструватись'),
});

export const taskStatusEnum = pgEnum('task_status', [
  'NEW',
  'IN_PROGRESS',
  'COMPLETED',
]);
export const taskPriorityEnum = pgEnum('task_priority', [
  'LOW',
  'MEDIUM',
  'HIGH',
]);

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  dueDate: text('due_date').notNull(),
  priority: taskPriorityEnum('priority').default('MEDIUM').notNull(),
  status: taskStatusEnum('status').default('NEW').notNull(),
  assigneeName: text('assignee_name').notNull(),
  description: text('description'),
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const taskComments = pgTable('task_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .references(() => tasks.id, { onDelete: 'cascade' })
    .notNull(),
  authorName: text('author_name').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasksRelations = relations(tasks, ({ many }) => ({
  comments: many(taskComments),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
}));
