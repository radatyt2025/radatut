import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';
import styles from '@/css/layout.module.css';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
