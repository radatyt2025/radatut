'use client';

import { AboutUsSection } from '@/components/shared/about-us/about-us';
import { Achievements } from '@/components/shared/about-us/achievements';
import { RegulatoryDocuments } from '@/components/shared/about-us/regulatory-documents';
import { StudentBenefits } from '@/components/shared/about-us/student-benefits';
import { WhatWeDo } from '@/components/shared/about-us/what-we-do';
import { Button } from '@/components/ui/button';
import styles from '@/css/about-us-page.module.css';

const galleryImages = [
  { src: '/images/about-us-1.png' },
  { src: '/images/about-us-2.png' },
  { src: '/images/about-us-3.png' },
  { src: '/images/about-us-3.png' },
  { src: '/images/about-us-3.png' },
  { src: '/images/about-us-3.png' },
];

export default function AboutUs() {
  return (
    <>
      <section className={styles.section}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.leftSide}>
              <h1 className={styles.title}>
                Студентська рада <br /> ІТ СТЕП Університету
              </h1>
              <p className={styles.description}>
                Студентська рада ІТ СТЕП Університету — це команда активних
                студентів, яка розвиває студентське життя, представляє інтереси
                молоді та створює можливості для розвитку поза навчанням. Ми
                працюємо над тим, щоб університет був не лише місцем навчання, а
                й простором для ідей, ініціатив і сильного ком’юніті.
              </p>
              <Button className={styles.joinButton}>Приєднатися</Button>
            </div>

            <div className={styles.imageWrapper}>
              <div className={styles.mainCircle} />
              <img
                src="/images/about-us-3.png"
                alt="Команда студентської ради"
                width={600}
                height={400}
                className={styles.teamImage}
              />
            </div>
          </div>

          <div className={styles.galleryGrid}>
            {galleryImages.map((img, index) => (
              <div key={index} className={styles.galleryItem}>
                <img
                  src={img.src}
                  alt={`Gallery ${index}`}
                  width={220}
                  height={140}
                  className={styles.galleryImg}
                />
              </div>
            ))}
            <div className={styles.galleryCircle} />
            <div className={styles.smallerGalleryCircle} />
          </div>
        </div>
      </section>
      <AboutUsSection />
      <WhatWeDo />
      <StudentBenefits />
      <Achievements />
      <RegulatoryDocuments />
    </>
  );
}
