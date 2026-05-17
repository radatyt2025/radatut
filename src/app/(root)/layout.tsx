'use client';

import { usePathname } from 'next/navigation';

import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';
import styles from '@/css/layout.module.css';

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const pathname = usePathname();

  const shouldShowModal =
    pathname.includes('/elections');

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        {children}

        {shouldShowModal && modal}
      </main>

      <Footer />
    </div>
  );
}