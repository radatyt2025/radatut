'use server';

import { Storage } from '@google-cloud/storage';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../../drizzle/drizzle-client';
import { documents } from '../../../drizzle/schema.drizzle';
import { createUpdate } from './updates';

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL!,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});
const BUCKET_NAME = process.env.GCS_BUCKET_NAME!;

export async function getDocuments() {
  try {
    return await db.query.documents.findMany({
      orderBy: [asc(documents.createdAt)],
    });
  } catch (error) {
    console.error('Get Documents Error:', error);
    return [];
  }
}

export async function createDocument(payload: {
  title: string;
  file: File;
  authorName: string;
}) {
  try {
    let fileUrl = '';

    if (payload.file && payload.file.size > 0) {
      const arrayBuffer = await payload.file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const sanitizedFilename = payload.file.name.replace(/\s+/g, '-');
      const uniqueFilename = `documents/${Date.now()}-${sanitizedFilename}`;

      const bucket = storage.bucket(BUCKET_NAME);
      const file = bucket.file(uniqueFilename);

      await file.save(buffer, {
        contentType: payload.file.type,
        resumable: false,
      });

      fileUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;
    } else {
      return { success: false, message: 'Файл є обов\'язковим' };
    }

    await db.insert(documents).values({
      title: payload.title,
      fileUrl: fileUrl,
    });

    revalidatePath('/office/documents'); // Замініть на ваш реальний шлях сторінки
    createUpdate({
      actionType: 'DOCUMENT',
      authorName: payload.authorName,
      entityTitle: payload.title,
    });
    return { success: true, message: 'Документ успішно додано!' };
  } catch (error) {
    console.error('Create Document Error:', error);
    return { success: false, message: 'Помилка при збереженні документа' };
  }
}

export async function deleteDocument(docId: string) {
  try {
    await db.delete(documents).where(eq(documents.id, docId));
    revalidatePath('/office/documents');
    return { success: true, message: 'Документ видалено' };
  } catch (error) {
    console.error('Delete Document Error:', error);
    return { success: false, message: 'Помилка видалення документа' };
  }
}
