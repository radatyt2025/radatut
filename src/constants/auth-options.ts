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
          role: 'CLIENT',
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

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, credentials.email),
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password || '',
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role || 'CLIENT',
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
          fullName: user.name,
          image: user.image,
          provider: account.provider as 'google' | 'github' | 'credentials',
          providerId: account.providerAccountId,
        });

        return true;
      } catch (error) {
        console.error('Error while execution next-auth signIn:', error);

        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullName = user.name;
        token.picture = user.image;
      }

      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
      }

      return session;
    },
  },
};
