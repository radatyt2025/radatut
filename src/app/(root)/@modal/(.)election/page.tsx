'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import styles from '@/css/election-modal.module.css';

const candidates = [
  {
    id: 1,
    name: 'Маркіян Костур',
    role: 'Студент 8 курсу',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    image: '/images/default.png',
    link: '#',
  },
  {
    id: 2,
    name: 'Ілля Бредіхін',
    role: 'Студент 8 курсу',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    image: '/images/default.png',
    link: '#',
  },
];

export default function ElectionModal() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Wizard State
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    candidateId: null as number | null,
  });

  // Handlers
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = () => {
    // Alert the collected data as requested
    alert(JSON.stringify(formData, null, 2));
    
    // Optionally close the modal after submitting:
    // router.back();
  };

  // Step Rendering Helpers
  const renderStep1 = () => (
    <>
      <h2 className={styles.sectionTitle}>Кандидати</h2>
      <div className={styles.candidatesGrid}>
        {candidates.map((candidate) => (
          <div key={candidate.id} className={styles.candidateCard}>
            <div className={styles.candidateImageWrapper}>
              <img src={candidate.image} alt={candidate.name} className={styles.candidateImage} />
            </div>
            <h3 className={styles.candidateName}>{candidate.name}</h3>
            <p className={styles.candidateRole}>{candidate.role}</p>
            <p className={styles.candidateDesc}>{candidate.description}</p>
            <a href={candidate.link} className={styles.presentationLink}>
              Презентація кандидата
            </a>
          </div>
        ))}
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className={styles.sectionTitle}>Дані студента</h2>
      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Ім&apos;я</label>
          <input
            type="text"
            name="firstName"
            className={styles.input}
            placeholder="Введіть ім'я..."
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Прізвище</label>
          <input
            type="text"
            name="lastName"
            className={styles.input}
            placeholder="Введіть прізвище..."
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>№ студентського квитка</label>
          <input
            type="text"
            name="studentId"
            className={styles.input}
            placeholder="Введіть номер..."
            value={formData.studentId}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className={styles.sectionTitle}>Оберіть свого кандидата</h2>
      <div className={styles.candidatesGrid}>
        {candidates.map((candidate) => {
          const isSelected = formData.candidateId === candidate.id;
          return (
            <div 
              key={candidate.id} 
              className={`${styles.candidateCard} ${styles.selectableCard} ${isSelected ? styles.selectableCardActive : ''}`}
              onClick={() => setFormData({ ...formData, candidateId: candidate.id })}
            >
              <div className={styles.candidateImageWrapper}>
                <img src={candidate.image} alt={candidate.name} className={styles.candidateImage} />
              </div>
              <h3 className={styles.candidateName}>{candidate.name}</h3>
              <p className={styles.candidateRole}>{candidate.role}</p>
              <p className={styles.candidateDesc}>{candidate.description}</p>
              
              <button className={`${styles.selectButton} ${isSelected ? styles.selectButtonActive : ''}`}>
                <div className={styles.radioCircle}>
                  <div className={styles.radioCircleInner} />
                </div>
                Обрати
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={styles.modalContent}>
        {/* Dynamic Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Footer Actions */}
        <div className={styles.footer}>
          <div className={styles.pagination}>
            {[1, 2, 3].map((num) => (
              <span
                key={num}
                className={step === num ? styles.pageActive : styles.pageNumber}
                onClick={() => setStep(num)}
              >
                {num}
              </span>
            ))}
          </div>
          {step === 1 && (
            <button className={styles.primaryButton} onClick={handleNextStep}>
              <ArrowRight />
            </button>
          )}
          {step === 2 && (
            <button className={styles.primaryButton} onClick={handleNextStep}>
              Далі
            </button>
          )}
          {step === 3 && (
            <button className={styles.primaryButton} onClick={handleSubmit}>
              Проголосувати
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
}