import Image from 'next/image';

import { heroData } from '@/constants/home/hero';
import styles from '@/css/hero.module.css';

export const Hero: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heroImageCard}>
          <Image
            src="/images/hero.png"
            alt="hero"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.gradientOverlay} />
          <div className={styles.heroContent}>
            <h1 className={styles.title} style={{ whiteSpace: 'pre-line' }}>
              {heroData.title}
            </h1>
            <p className={styles.subtitle}>{heroData.subTitle}</p>
          </div>
        </div>
      </div>

      <div className={styles.aboutContainer}>
        <h2 className={styles.aboutTitle}>{heroData.aboutSection.title}</h2>
        <p className={styles.aboutText}>{heroData.aboutSection.text}</p>
      </div>
    </section>
  );
};
