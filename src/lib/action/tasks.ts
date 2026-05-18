'use server';

import { Storage } from '@google-cloud/storage';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../../drizzle/drizzle-client';
import { tasks, taskComments } from '../../../drizzle/schema.drizzle';

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL!,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});
const BUCKET_NAME = process.env.GCS_BUCKET_NAME!;

export type CreateTaskPayload = {
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
  assigneeName: string;
  description?: string;
  attachmentFile?: File | null;
};

export async function getTasks() {
  try {
    const allTasks = await db.query.tasks.findMany({
      orderBy: [asc(tasks.createdAt)], 
      with: {
        comments: {
          orderBy: [asc(taskComments.createdAt)], 
        },
      },
    });
    return allTasks;
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return [];
  }
}

export async function getUsers() {
  return await db.query.users.findMany({
    orderBy: (users, { asc }) => [asc(users.fullName)],
  });
}

export async function createTask(payload: CreateTaskPayload) {
  try {
    let fileUrl = null;
    if (payload.attachmentFile && payload.attachmentFile.size > 0) {
      const arrayBuffer = await payload.attachmentFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const sanitizedFilename = payload.attachmentFile.name.replace(
        /\s+/g,
        '-',
      );
      const uniqueFilename = `tasks/${Date.now()}-${sanitizedFilename}`;

      const bucket = storage.bucket(BUCKET_NAME);
      const file = bucket.file(uniqueFilename);

      await file.save(buffer, {
        contentType: payload.attachmentFile.type,
        resumable: false,
      });

      fileUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;
    }

    await db.insert(tasks).values({
      title: payload.title,
      dueDate: payload.dueDate,
      priority: payload.priority,
      status: payload.status || 'NEW',
      assigneeName: payload.assigneeName,
      description: payload.description || '',
      attachmentUrl: fileUrl,
    });

    revalidatePath('/tasks');
    return { success: true, message: 'Задачу створено!' };
  } catch (error) {
    console.error('Create Task Error:', error);
    return { success: false, message: 'Помилка при створенні задачі' };
  }
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED',
) {
  try {
    await db
      .update(tasks)
      .set({ status: newStatus })
      .where(eq(tasks.id, taskId));
    revalidatePath('/tasks');
    return { success: true };
  } catch (error) {
    console.error('Update Task Status Error:', error);
    return { success: false, message: 'Помилка оновлення статусу' };
  }
}

export async function addTaskComment(
  taskId: string,
  authorName: string,
  text: string,
) {
  try {
    await db.insert(taskComments).values({
      taskId,
      authorName,
      text,
    });
    revalidatePath('/tasks');
    return { success: true };
  } catch (error) {
    console.error('Add Task Comment Error:', error);
    return { success: false, message: 'Не вдалося додати коментар' };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    revalidatePath('/tasks');
    return { success: true };
  } catch (error) {
    console.error('Delete Task Error:', error);
    return { success: false, message: 'Помилка видалення задачі' };
  }
}