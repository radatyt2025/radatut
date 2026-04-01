'use server';

import { hashSync } from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db } from '../../../drizzle/drizzle-client';
import { users } from '../../../drizzle/schema.drizzle';

type RegisterPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  try {
    const [isUserExist] = await db
      .select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (isUserExist) {
      throw new Error('User already exist');
    }

    await db.insert(users).values({
      email: payload.email,
      password: hashSync(payload.password, 10),
      provider: 'credentials',
      providerId: 'credentials',
    });
  } catch (error) {
    console.error('Error while execution register-user:', error);
    throw error;
  }
}
