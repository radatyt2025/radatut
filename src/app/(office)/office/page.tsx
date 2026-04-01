'use client';

import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export default function Office() {
  const { data: session } = useSession();
  const handleLogOut = () => {
    signOut({
      callbackUrl: '/',
    });
  };
  return (
    <div>
      {session && (
        <div className="flex flex-col">
          <span>{session?.user.id}</span>
          <span>{session?.user.email}</span>
        </div>
      )}
      <Button
        variant="secondary"
        onClick={handleLogOut}
        className="gap-2 h-12 p-2 flex-1">
        LogOut
      </Button>
    </div>
  );
}
