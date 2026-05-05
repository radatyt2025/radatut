import { InferSelectModel } from 'drizzle-orm';

import { db } from '../../drizzle/drizzle-client';
import { users } from '../../drizzle/schema.drizzle';

export type TeamMember = InferSelectModel<typeof users>;

export const getTeam = async (): Promise<TeamMember[]> => {
  const teamData = await db.query.users.findMany();

  return teamData;
};
