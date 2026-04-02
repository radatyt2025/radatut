'use server';

import { hashSync } from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db } from '../../../drizzle/drizzle-client';
import { users } from '../../../drizzle/schema.drizzle';

type RegisterPayload = {
  email: string;
  password: string;
};

type RegisterUserResponse = {
  success: boolean;
  message?: string;
  field?: 'email' | 'password';
};

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterUserResponse> {
  try {
    const [isUserExist] = await db
      .select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (isUserExist) {
      return {
        success: false,
        message: 'Користувач з цією поштою вже існує',
        field: 'email',
      };
    }

    await db.insert(users).values({
      email: payload.email,
      password: hashSync(payload.password, 10),
      provider: 'credentials',
      providerId: 'credentials',
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Сталася непередбачена помилка. Спробуйте пізніше.',
    };
  }
}
