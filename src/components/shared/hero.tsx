import Image from 'next/image';

import styles from '@/css/hero.module.css';

export const Hero: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.heroContainer}>
        <div className={styles.heroImageCard}>
          <Image
            src="/hero.png"
            alt="hero"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.gradientOverlay} />
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Студентська рада
              <br />
              IT СТЕП Університету
            </h1>
            <p className={styles.subtitle}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.aboutContainer}>
        <h2 className={styles.aboutTitle}>ПРО НАС</h2>
        <p className={styles.aboutText}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
          since the 1500s, Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry&apos;s standard
          dummy text ever since the 1500s
        </p>
      </div>
    </section>
  );
};