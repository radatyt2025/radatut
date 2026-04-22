'use client';

import { Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { headerLabels, navLinks } from '@/constants/shared/header';
import styles from '@/css/header.module.css';

import { Button } from '../ui/button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Button className={styles.logo} variant="link" asChild>
          <Link href={headerLabels.homeHref}>{headerLabels.logo}</Link>
        </Button>
        <div
          className={`${styles.navWrapper} ${isMenuOpen ? styles.navWrapperOpen : ''}`}>
          <nav className={styles.nav}>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          {!session ? (
            <Button variant="link" className={styles.cabinetBtn} asChild>
              <Link href={headerLabels.login.href}>{headerLabels.login.label}</Link>
            </Button>
          ) : (
            <Button variant="link" className={styles.cabinetBtn} asChild>
              <Link href={headerLabels.cabinet.href}>{headerLabels.cabinet.label}</Link>
            </Button>
          )}
        </div>

        <button className={styles.hamburger} onClick={toggleMenu}>
          <Menu />
        </button>
      </div>
    </header>
  );
};
