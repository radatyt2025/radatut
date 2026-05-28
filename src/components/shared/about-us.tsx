import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import styles from '@/css/about-us.module.css';

export const AboutUs: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.largeImageContainer}>
            <img
              src="/images/home/about-us-main.webp"
              alt="Студентська рада подія 1"
              className={styles.image}
            />
          </div>
          <div className={styles.rightSideWrapper}>
            <div className={styles.buttonContainer}>
              <Button variant="outline" asChild>
                <Link href="/about-us">Детальніше</Link>
              </Button>
            </div>
            <div className={styles.smallImagesRow}>
              <div className={styles.smallImageContainer}>
                <img
                  src="/images/home/about-us-side-1.webp"
                  alt="Студентська рада подія 2"
                  className={styles.image}
                />
              </div>
              <div className={styles.smallImageContainer}>
                <img
                  src="/images/home/about-us-side-2.webp"
                  alt="Студентська рада подія 3"
                  className={styles.image}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
