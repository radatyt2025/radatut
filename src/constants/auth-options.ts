import { compare } from 'bcrypt';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '../../drizzle/drizzle-client';
import { Team, UserRole } from '../../drizzle/schema.drizzle';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, credentials.email),
        });

        if (!user) return null;

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) return null;

        if (
          !user.email ||
          !user.fullName ||
          !user.imageUrl ||
          !user.role ||
          !user.team
        ) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          image: user.imageUrl,
          role: user.role,
          team: user.team,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.image = user.image;
        token.role = user.role;
        token.team = user.team;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        fullName: token.fullName as string,
        image: token.image as string,
        role: token.role as UserRole,
        team: token.team as Team,
      };

      return session;
    },
  },
};