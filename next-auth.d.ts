export type UserRole = 'USER' | 'ADMIN';
export type Team = 'Медіа' | 'Управління';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      image: string;
      role: UserRole;
      team: Team;
      position: string;
    };
  }

  interface User {
    id: string;
    email: string;
    fullName: string;
    image: string;
    role: UserRole;
    team: Team;
    position: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    team: Team;
    email?: string;
    fullName?: string;
    image?: string;
    position?: string;
  }
}
