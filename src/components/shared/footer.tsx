import Link from 'next/link';

import { footerData } from '@/constants/shared/footer';
import styles from '@/css/footer.module.css';

import { Button } from '../ui/button';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.brand}>
            <Button className={styles.logo} variant="link" asChild>
              <Link href={footerData.logo.href}>{footerData.logo.label}</Link>
            </Button>
            <a
              href={footerData.socials[0].href}
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
              {footerData.navLinks.map((link) => (
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
            <a href={footerData.contacts.phone.href} className={styles.link}>
              {footerData.contacts.phone.label}
            </a>
            <a href={footerData.contacts.email.href} className={styles.link}>
              {footerData.contacts.email.label}
            </a>
          </div>
          <div className={styles.legalInfo}>
            {footerData.legal.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
