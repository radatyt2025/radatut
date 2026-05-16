'use server';

import { eq, and } from 'drizzle-orm';

import { db } from '../../../drizzle/drizzle-client';
import {
  elections,
  candidates,
  votes,
  users,
  validStudentTickets,
} from '../../../drizzle/schema.drizzle';

export async function submitVote(data: {
  electionId: string;
  candidateId: string;
  firstName: string;
  lastName: string;
  studentId: string;
}) {
  const isValidTicket = await db.query.validStudentTickets.findFirst({
    where: eq(validStudentTickets.ticketNumber, data.studentId),
  });

  if (!isValidTicket) {
    return { error: 'Цього номера студентського квитка не існує в базі.' };
  }

  const existingVote = await db.query.votes.findFirst({
    where: and(
      eq(votes.electionId, data.electionId),
      eq(votes.studentId, data.studentId),
    ),
  });

  if (existingVote) {
    return { error: 'Ви вже проголосували на цих виборах.' };
  }

  await db.insert(votes).values(data);
  return { success: true };
}

export async function getElections() {
  return await db.query.elections.findMany({
    with: {
      candidates: true,
      votes: true,
    },
    orderBy: (elections, { desc }) => [desc(elections.createdAt)],
  });
}

export async function getUsers() {
  return await db.query.users.findMany({
    orderBy: (users, { asc }) => [asc(users.fullName)],
  });
}

export async function createElection(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  await db
    .insert(elections)
    .values({
      title,
      description,
    })
    .returning();
}

export async function deleteElection(id: string) {
  await db.delete(elections).where(eq(elections.id, id));
}

export async function addCandidate(formData: FormData) {
  const electionId = formData.get('electionId') as string;
  const userId = formData.get('userId') as string;

  if (!userId) return;

  const selectedUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!selectedUser) {
    throw new Error('User not found');
  }

  await db.insert(candidates).values({
    electionId,
    name: selectedUser.fullName,
    role: selectedUser.team,
    description: selectedUser.description,
    imageUrl: selectedUser.imageUrl,
    link: selectedUser.telegramLink,
  });
}
