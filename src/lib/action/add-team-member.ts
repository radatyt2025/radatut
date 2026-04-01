'use server';

import { eq } from 'drizzle-orm';

import { db } from '../../../drizzle/drizzle-client';
import { team } from '../../../drizzle/schema.drizzle';

type AddTeamMemberPayload = {
  fullName: string;
  role: string;
  imageSrc: string;
};

type AddTeamMemberResponse = {
  success: boolean;
  message?: string;
  field?: 'fullName' | 'role' | 'imageSrc';
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

    await db.insert(team).values({
      fullName: payload.fullName,
      role: payload.role,
      imageSrc: payload.imageSrc,
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
