import { Team } from '../../drizzle/schema.drizzle';

export type TeamMemberModel = {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  imageUrl: string;
  team: Team;
  telegramLink?: string;
  instagramLink?: string;
  description?: string;
};
