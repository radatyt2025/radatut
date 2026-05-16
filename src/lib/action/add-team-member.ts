'use server';

import type { InferInsertModel } from 'drizzle-orm';

import { Storage } from '@google-cloud/storage';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../../drizzle/drizzle-client';
import { Team, users } from '../../../drizzle/schema.drizzle';

type NewUser = InferInsertModel<typeof users>;

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
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  team: Team;
  imageFile: File;

  telegramLink?: string;
  instagramLink?: string;
  description?: string;
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
      .from(users)
      .where(eq(users.fullName, payload.fullName))
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

    const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;

    const newUser: NewUser = {
      fullName: payload.fullName,
      email: payload.email,
      password: await hash(payload.password, 10),
      role: payload.role,
      team: payload.team,
      imageUrl,
      telegramLink: payload.telegramLink ?? '',
      instagramLink: payload.instagramLink ?? '',
      description: payload.description ?? '',
      provider: 'credentials',
    };

    await db.insert(users).values(newUser);

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
