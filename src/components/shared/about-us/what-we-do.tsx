import React from 'react';

import styles from '@/css/about-us/what-we-do.module.css';

import { Container } from '../container';

export const WhatWeDo: React.FC = () => {
  const cardsData = [
    {
      id: 1,
      title: 'Організовуємо події',
      imageSrc: '/images/about-us-4.jpg',
      description:
        'Вечорниці, зустрічі, поїздки, благодійні ініціативи та студентські заходи, які об\'єднують людей.',
    },
    {
      id: 2,
      title: 'Розвиваємо ком\'юніті',
      imageSrc: '/images/about-us-4.jpg',
      description:
        'Створюємо середовище, де легко знайомитись, спілкуватись і знаходити однодумців.',
    },
    {
      id: 3,
      title: 'Представляємо студентів',
      imageSrc: '/images/about-us-4.jpg',
      description:
        'Комунікуємо з адміністрацією та захищаємо інтереси студентства.',
    },
    {
      id: 4,
      title: 'Співпрацюємо',
      imageSrc: '/images/about-us-4.jpg',
      description:
        'Працюємо з іншими студентськими організаціями, партнерами та міськими ініціативами.',
    },
  ];
  return (
    <Container>
      <h2 className={styles.heading}>ЩО МИ РОБИМО</h2>
      <div className={styles.grid}>
        {cardsData.map((card) => (
          <div key={card.id} className={styles.card}>
            <div className={styles.gradientOverlay} />
            <img
              className={styles.image}
              src={card.imageSrc}
              alt={card.title}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
