'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../../drizzle/drizzle-client';
import { team } from '../../../drizzle/schema.drizzle';

export async function deleteTeamMember(id: string) {
  try {
    await db.delete(team).where(eq(team.id, id));

    revalidatePath('/');
    revalidatePath('/team');
    revalidatePath('/dashboard/team-members');

    return { success: true, message: 'Успішно видалено' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Помилка при видаленні' };
  }
}
