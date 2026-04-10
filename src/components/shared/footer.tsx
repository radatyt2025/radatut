import Link from 'next/link';

import styles from '@/css/footer.module.css';

import { Button } from '../ui/button';

export const Footer: React.FC = () => {
  const navLinks = [
    { label: 'Події', href: '/events' },
    { label: 'Про нас', href: '/about-us' },
    { label: 'Вибори голови ОСС', href: '/elections' },
    { label: 'Кабінет', href: '/cabinet' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.brand}>
            <Button className={styles.logo} variant="link" asChild>
              <Link href="/">РадаТут</Link>
            </Button>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.contactInfo}>
            <a href="tel:+380000000000" className={styles.link}>
              +380 00 000 00 00
            </a>
            <a href="mailto:itstepsupport@gmail.com" className={styles.link}>
              itstepsupport@gmail.com
            </a>
          </div>
          <div className={styles.legalInfo}>
            <Link href="/privacy" className={styles.link}>
              Політика конфіденційності
            </Link>
            <Link href="/terms" className={styles.link}>
              Умови користування
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
