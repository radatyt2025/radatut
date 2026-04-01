import { compare } from 'bcrypt';
import { and, eq, or } from 'drizzle-orm';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { db } from '../../drizzle/drizzle-client';
import { users } from '../../drizzle/schema.drizzle';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'USER',
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const findUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, credentials.email),
        });

        if (!findUser) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          findUser.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'credentials') {
          return true;
        }

        if (
          !user.email ||
          !account ||
          !account.providerAccountId ||
          !account.provider
        ) {
          return false;
        }

        const [userExist] = await db
          .select()
          .from(users)
          .where(
            or(
              and(
                eq(
                  users.provider,
                  account.provider! as 'google' | 'github' | 'credentials',
                ),
                eq(users.providerId, account.providerAccountId),
              ),
              eq(users.email, user.email!),
            ),
          )
          .limit(1);

        if (userExist) {
          await db
            .update(users)
            .set({
              provider: account?.provider as
                | 'google'
                | 'github'
                | 'credentials',
              providerId: account?.providerAccountId,
            })
            .where(eq(users.id, userExist.id));

          return true;
        }

        await db.insert(users).values({
          email: user.email,
          password: '',
          provider: account.provider as 'google' | 'github' | 'credentials',
          providerId: account.providerAccountId,
        });

        return true;
      } catch (error) {
        console.error('Error while execution next-auth signIn:', error);

        return false;
      }
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }
      const [userExist] = await db
        .select()
        .from(users)
        .where(eq(users.email, token.email))
        .limit(1);

      if (userExist) {
        token.id = String(userExist.id);
        token.email = userExist.email;
        token.fullName = userExist.fullName;
        token.role = userExist.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
