'use server';

import { Storage } from '@google-cloud/storage';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../../drizzle/drizzle-client';
import { team } from '../../../drizzle/schema.drizzle';

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL!,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const BUCKET_NAME = process.env.GCS_BUCKET_NAME!;

type AddTeamMemberPayload = {
  fullName: string;
  role: string;
  imageFile: File;
};

type AddTeamMemberResponse = {
  success: boolean;
  message?: string;
  field?: 'fullName' | 'role' | 'imageFile';
};

export async function addTeamMember(
  payload: AddTeamMemberPayload,
): Promise<AddTeamMemberResponse> {
  try {
    const [isMemberExist] = await db
      .select()
      .from(team)
      .where(eq(team.fullName, payload.fullName))
      .limit(1);

    if (isMemberExist) {
      return {
        success: false,
        message: 'Користувач уже існує',
        field: 'fullName',
      };
    }

    const arrayBuffer = await payload.imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedFilename = payload.imageFile.name.replace(/\s+/g, '-');
    const uniqueFilename = `team-members/${Date.now()}-${sanitizedFilename}`;

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(uniqueFilename);

    await file.save(buffer, {
      contentType: payload.imageFile.type,
      resumable: false,
    });

    const imageSrc = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;

    await db.insert(team).values({
      fullName: payload.fullName,
      role: payload.role,
      imageSrc,
    });

    revalidatePath('/');
    revalidatePath('/team');
    revalidatePath('/dashboard/team-members');

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Сталася непередбачена помилка. Спробуйте пізніше.',
    };
  }
}
