import React from 'react';

import styles from '@/css/about-us/student-benefits.module.css';

import { Container } from '../container';

const benefitCards = [
  { id: 1, text: 'Знайти нові знайомства та контакти' },
  { id: 2, text: 'Долучитись до великих подій і ініціатив' },
  { id: 3, text: 'Розвинути soft skills і лідерство' },
  { id: 4, text: 'Отримати реальний досвід у проєктах' },
  { id: 5, text: 'Впливати на життя університету' },
];

export const StudentBenefits: React.FC = () => {
  return (
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.subtitle}>
            Участь у студентській раді - це можливість:
          </div>
          <div className={styles.titleContainer}>
            <h1 className={styles.aboutTitle}>ЩО ОТРИМУЄ</h1>
            <h1 className={styles.aboutTitle}>СТУДЕНТ</h1>
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {benefitCards.map((card) => (
            <div key={card.id} className={styles.card}>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.imagesContainer}>
          <img
            src="/images/default.png"
            alt="Студентська рада 1"
            className={styles.imageSmall}
          />
          <img
            src="/images/default.png"
            alt="Студентська рада 2"
            className={styles.imageLarge}
          />
        </div>
      </div>
    </Container>
  );
};
