'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import styles from '@/css/events/add-event-modal.module.css';
import { createEvent } from '@/lib/action/events';

export default function AddEventModal() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  
  const [eventType, setEventType] = useState<'INTERNAL' | 'EXTERNAL' | 'ELECTION'>('INTERNAL');
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      router.back();
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.description) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    if (!imageFile) {
      toast.error('Будь ласка, додайте головне зображення');
      return;
    }

    startTransition(async () => {
      const response = await createEvent({
        ...formData,
        type: eventType,
        imageFile: imageFile, 
      });

      if (response.success) {
        toast.success(response.message);
        router.back();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Додавання події</h2>
        
        <div className={styles.tabs}>
          <button 
            className={eventType === 'INTERNAL' ? styles.tabActive : styles.tabInactive}
            onClick={() => setEventType('INTERNAL')}
            type="button"
          >
            Внутрішня подія
          </button>
          <button 
            className={eventType === 'EXTERNAL' ? styles.tabActive : styles.tabInactive}
            onClick={() => setEventType('EXTERNAL')}
            type="button"
          >
            Зовнішня подія
          </button>
          <button 
            className={eventType === 'ELECTION' ? styles.tabActive : styles.tabInactive}
            onClick={() => setEventType('ELECTION')}
            type="button"
          >
            Вибори
          </button>
        </div>

        <div className={styles.formBody}>
          <div className={styles.topSection}>
            <div className={styles.imageUploadWrapper}>
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <button 
                className={styles.imageUploadBox} 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ overflow: 'hidden', padding: previewUrl ? 0 : undefined }}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon />
                )}
              </button>
            </div>

            <div className={styles.topInputs}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Назва події</label>
                <input 
                  type="text" 
                  name="title"
                  className={styles.input} 
                  placeholder="Введіть назву..." 
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.rowInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Дата</label>
                  <input 
                    type="text" 
                    name="date"
                    className={styles.input} 
                    placeholder="дд.мм.рррр" 
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Час</label>
                  <input 
                    type="text" 
                    name="time"
                    className={styles.input} 
                    placeholder="00-00" 
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Опис події</label>
            <textarea 
              name="description"
              className={styles.textarea} 
              placeholder="Введіть опис..." 
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.submitButton} 
            onClick={handleSubmit}
            disabled={isPending}
            type="button"
          >
            {isPending ? 'Створення...' : 'Створити подію'}
          </button>
        </div>
      </div>
    </div>
  );
}

const ImageIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a3c4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);
