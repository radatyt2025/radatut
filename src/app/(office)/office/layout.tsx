import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';
import styles from '@/css/layout.module.css';

export default function OfficeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
        {modal}
      </main>
      <Footer />
    </div>
  );
}
