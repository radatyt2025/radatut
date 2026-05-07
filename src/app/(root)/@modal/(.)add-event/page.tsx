'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import styles from '@/css/events/add-event-modal.module.css';

export default function AddEventModal() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [eventType, setEventType] = useState<'internal' | 'external'>('internal');

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      router.back();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        
        <h2 className={styles.title}>Додавання події</h2>
        
        <div className={styles.tabs}>
          <button 
            className={eventType === 'internal' ? styles.tabActive : styles.tabInactive}
            onClick={() => setEventType('internal')}
            type="button"
          >
            Внутрішня подія
          </button>
          <button 
            className={eventType === 'external' ? styles.tabActive : styles.tabInactive}
            onClick={() => setEventType('external')}
            type="button"
          >
            Зовнішня подія
          </button>
        </div>

        <div className={styles.formBody}>
          
          <div className={styles.topSection}>
            <div className={styles.imageUploadWrapper}>
              <button className={styles.imageUploadBox} type="button">
                <ImageIcon />
              </button>
            </div>

            <div className={styles.topInputs}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Назва події</label>
                <input type="text" className={styles.input} placeholder="Введіть назву..." />
              </div>
              
              <div className={styles.rowInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Дата</label>
                  <input type="text" className={styles.input} placeholder="дд.мм.рррр" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Час</label>
                  <input type="text" className={styles.input} placeholder="00-00" />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Опис події</label>
            <textarea className={styles.textarea} placeholder="Введіть опис..." />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Галерея фото</label>
            <div className={styles.gallery}>
              <button className={styles.galleryAddButton} type="button">
                <PlusIcon />
              </button>
            </div>
          </div>

        </div>

        <div className={styles.footer}>
          <button className={styles.submitButton} type="button">
            Створити подію
          </button>
        </div>

      </div>
    </div>
  );
}

// Icons
const ImageIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a3c4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3c4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);