import React from 'react';

import styles from '@/css/about-us/about-us-section.module.css';

import { Container } from '../container';

export const AboutUsSection: React.FC = () => {
  return (
    <Container>
      <h2 className={styles.heading}>ПРО НАС</h2>
      <div className={styles.listContainer}>
        <div className={styles.rowLeft}>
          <div className={styles.circle}></div>
          <div className={styles.textBox}>
            Студентська рада — це середовище, де студенти можуть впливати на
            університет, реалізовувати власні ідеї та розвиватися через
            практичний досвід.
          </div>
        </div>

        <div className={styles.rowRight}>
          <div className={`${styles.textBox} ${styles.textRight}`}>
            Ми виступаємо як міст між студентами та адміністрацією, допомагаючи
            доносити думку студентів і брати участь у формуванні студентського
            життя.
          </div>
          <div className={styles.circle}></div>
        </div>

        <div className={styles.rowLeft}>
          <div className={styles.circle}></div>
          <div className={styles.textBox}>
            Наша діяльність — це не лише організація подій, а створення системи
            можливостей, де кожен може знайти себе: в організації, комунікації,
            креативі чи управлінні.
          </div>
        </div>
      </div>
    </Container>
  );
};
