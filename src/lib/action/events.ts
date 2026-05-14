'use server';

import { Storage } from '@google-cloud/storage';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../../drizzle/drizzle-client';
import { events } from '../../../drizzle/schema.drizzle';

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL!,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const BUCKET_NAME = process.env.GCS_BUCKET_NAME!;

export type CreateEventPayload = {
  title: string;
  date: string;
  time?: string | null;
  description: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'ELECTION';
  imageFile: File;
};

export async function createEvent(payload: CreateEventPayload) {
  try {
    const arrayBuffer = await payload.imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedFilename = payload.imageFile.name.replace(/\s+/g, '-');
    const uniqueFilename = `events/${Date.now()}-${sanitizedFilename}`; 

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(uniqueFilename);

    await file.save(buffer, {
      contentType: payload.imageFile.type,
      resumable: false,
    });

    const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;

    const newEvent = {
      title: payload.title,
      date: payload.date,
      time: payload.time ?? null, 
      description: payload.description,
      type: payload.type as 'INTERNAL' | 'EXTERNAL',
      imageUrl: imageUrl, 
    };

    await db.insert(events).values(newEvent);

    await db.insert(events).values(newEvent);
    
    revalidatePath('/profile'); 
    revalidatePath('/events');
    revalidatePath('/office/events');
    
    return { success: true, message: 'Подію успішно створено!' };
  } catch (error) {
    console.error('Create Event Error:', error);
    return { success: false, message: 'Помилка при створенні події' };
  }
}

export async function getEvents() {
  try {
    const allEvents = await db.select().from(events);
    return allEvents;
  } catch (error) {
    console.error('Get Events Error:', error);
    return [];
  }
}

export async function deleteEvent(id: string) {
  try {
    
    await db.delete(events).where(eq(events.id, id));
    
    revalidatePath('/profile');
    revalidatePath('/events');
    revalidatePath('/office/events');
    
    return { success: true, message: 'Подію видалено' };
  } catch (error) {
    console.error('Delete Event Error:', error);
    return { success: false, message: 'Помилка при видаленні події' };
  }
}