'use client';

import Link from 'next/link';
import { useState } from 'react';

import styles from '@/css/header.module.css';

import { Button } from '../ui/button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    {
      label: 'Про нас',
      href: '/about-us',
    },
    {
      label: 'Команда',
      href: '/team',
    },
    {
      label: 'Події',
      href: '/events',
    },
    {
      label: 'Нормативні документи',
      href: '/documents',
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Button className={styles.logo} variant="link" asChild>
          <Link href="/">РадаТут</Link>
        </Button>
        <div
          className={`${styles.navWrapper} ${isMenuOpen ? styles.navWrapperOpen : ''}`}>
          <nav className={styles.nav}>
            {navLinks.map((item) => (
              <Link key={item.href} className={styles.navLink} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Button variant="link" className={styles.cabinetBtn} asChild>
            <Link href="/office">Кабінет</Link>
          </Button>
        </div>

        <button className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </header>
  );
};
