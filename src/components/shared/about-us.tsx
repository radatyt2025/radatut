import Image from 'next/image';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import styles from '@/css/about-us.module.css';

export const AboutUs: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.largeImageContainer}>
            <Image
              src="/images/hero.png"
              alt="Студентська рада подія 1"
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.rightSideWrapper}>
            <div className={styles.buttonContainer}>
              <Button variant="outline">Детальніше</Button>
            </div>
            <div className={styles.smallImagesRow}>
              <div className={styles.smallImageContainer}>
                <Image
                  src="/images/about-us-1.png"
                  alt="Студентська рада подія 2"
                  fill
                  className={styles.image}
                />
              </div>
              <div className={styles.smallImageContainer}>
                <Image
                  src="/images/about-us-2.png"
                  alt="Студентська рада подія 3"
                  fill
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
