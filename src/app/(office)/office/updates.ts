'use server';

import { desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../../../drizzle/drizzle-client';
import { updates } from '../../../../drizzle/schema.drizzle';

export async function getUpdates() {
  try {
    return await db.query.updates.findMany({
      orderBy: [desc(updates.createdAt)],
    });
  } catch (error) {
    console.error('Get Updates Error:', error);
    return [];
  }
}


export async function createUpdate(payload: {
  actionType: 'TASK' | 'DOCUMENT';
  authorName: string;
  targetName?: string;
  entityTitle?: string;
}) {
  try {
    await db.insert(updates).values({
      actionType: payload.actionType,
      authorName: payload.authorName,
      targetName: payload.targetName || '',
      entityTitle: payload.entityTitle || '',
    });
    
    revalidatePath('/updates'); 
    return { success: true };
  } catch (error) {
    console.error('Create Update Error:', error);
    return { success: false, message: 'Помилка при створенні логу' };
  }
}