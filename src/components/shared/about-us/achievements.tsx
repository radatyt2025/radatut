import React from 'react';

import styles from '@/css/about-us/achievements.module.css';

import { Container } from '../container';

const achievementsData = [
  { id: 1, title: 'МЕРЧ', description: 'створили власний брендований мерч, який об’єднує студентів' },
  { id: 2, title: 'УЧАСТЬ', description: 'студентів у національних студентських заходах' },
  { id: 3, title: 'СОТНІ', description: 'створених та проведених студентських подій' },
  { id: 4, title: 'РЕКОРД', description: 'серед студентських донорських акцій Львова за один день' },
  { id: 5, title: 'СТВОРИЛИ', description: 'дружну, активну студентську спільноту в університеті' },
  { id: 6, title: 'ДЕСЯТКИ', description: 'зроблених благодійних ініціатив, зокрема донорство крові' },
  { id: 7, title: 'СПІВПРАЦЯ', description: 'з міськими та всеукраїнськими організаціями' },
];

export const Achievements: React.FC = () => {
  return (
    <Container>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <h1 className={styles.aboutTitle}>ДОСЯГНЕННЯ</h1>
          <div className={styles.subtitle}>
            За час роботи ми:
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {achievementsData.map((item) => (
            <div key={item.id} className={styles.card}>
              <img
                src="/images/default.png"
                alt={item.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </Container>
  );
};