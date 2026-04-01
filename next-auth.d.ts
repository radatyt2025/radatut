import { UserRole } from '@prisma/client';
import { DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import { DefaultJWT } from 'next-auth/jwt';

type UserRole = 'CLIENT' | 'ADMIN' | 'OWNER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
  }
}
