import React from 'react';

import styles from '@/css/about-us/our-values.module.css';

import { Container } from '../container';

const valuesData = [
  {
    id: 1,
    title: 'Ініціативність',
    text: '— кожен може пропонувати і реалізовувати ідеї',
  },
  {
    id: 2,
    title: 'Розвиток',
    text: '— постійно ростемо як команда і як особистості',
  },
  {
    id: 3,
    title: 'Відкритість',
    text: '— до людей, думок і нових форматів',
  },
  {
    id: 4,
    title: 'Відповідальність',
    text: '— доводимо справи до результату',
  },
  {
    id: 5,
    title: 'Ком\'юніті',
    text: '— ми про людей і взаємопідтримку',
  },
];

export const OurValues: React.FC = () => {
  return (
    <Container>
      <div className={styles.wrapper}>
        <h2 className={styles.aboutTitle}>НАШІ ЦІННОСТІ</h2>

        <div className={styles.imageContainer}>
          <img
            src="/images/about-us-5.jpg"
            alt="Наші цінності фон"
            className={styles.backgroundImage}
          />
          <div className={styles.overlay} />

          <div className={styles.grid}>
            {valuesData.map((item) => (
              <div
                key={item.id}
                className={`${styles.card} ${styles[`card${item.id}`]}`}>
                <div className={styles.numberCircle}>{item.id}</div>
                <p className={styles.cardContent}>
                  <span className={styles.cardTitle}>{item.title}</span>{' '}
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
