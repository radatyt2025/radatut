import { InferSelectModel } from 'drizzle-orm';

import { db } from '../../drizzle/drizzle-client';
import { team } from '../../drizzle/schema.drizzle';

export type TeamMember = InferSelectModel<typeof team>;

export const getTeam = async (): Promise<TeamMember[]> => {
  const teamData = await db.query.team.findMany();
  
  return teamData;
};