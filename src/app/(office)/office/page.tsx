'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import styles from '@/css/office.module.css';

export default function Office() {
  const { data: session } = useSession();
  const handleLogOut = () => {
    signOut({
      callbackUrl: '/',
    });
  };
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {session && (
          <div className="flex flex-col">
            <Image
              width={200}
              height={200}
              src={session.user.image ?? '/images/default-avatar.webp'}
              alt="profile picture"
            />
            <span>{session.user.id}</span>
            <span>{session.user.email}</span>
          </div>
        )}
        <Button variant="destructive" onClick={handleLogOut}>
          LogOut
        </Button>
      </div>
    </section>
  );
}
