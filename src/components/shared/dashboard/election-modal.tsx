'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import styles from '@/css/election-modal.module.css';
import { submitVote } from '@/lib/action/election';

type Candidate = {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  link: string;
};

interface ElectionModalProps {
  electionId: string;
  candidates: Candidate[];
}

export default function ElectionModal({
  electionId,
  candidates = [],
}: ElectionModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    candidateId: null as string | null,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const closeModal = React.useCallback(() => {
    router.push('/');
  }, [router]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, closeModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (step === 2) {
      let isValid = true;
      const newErrors = { firstName: '', lastName: '', studentId: '' };

      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Ім\'я є обов\'язковим';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Прізвище є обов\'язковим';
        isValid = false;
      }
      if (!formData.studentId.trim()) {
        newErrors.studentId = 'Номер квитка є обов\'язковим';
        isValid = false;
      } else if (formData.studentId.trim().length < 4) {
        newErrors.studentId = 'Номер квитка занадто короткий';
        isValid = false;
      }

      setErrors(newErrors);

      if (!isValid) return;
    }

    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!formData.candidateId) {
      setSubmitError('Будь ласка, оберіть кандидата.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const result = await submitVote({
      electionId,
      candidateId: formData.candidateId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      studentId: formData.studentId.trim(),
    });

    setIsSubmitting(false);

    if (result?.error) {
      setSubmitError(result.error);
    } else {
      toast.success('Голос успішно зараховано!');
      closeModal();
    }
  };

  const renderStep1 = () => (
    <>
      <h2 className={styles.sectionTitle}>Кандидати</h2>
      <div className={styles.candidatesGrid}>
        {candidates.map((candidate) => (
          <div key={candidate.id} className={styles.candidateCard}>
            <div className={styles.candidateImageWrapper}>
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                className={styles.candidateImage}
              />
            </div>
            <h3 className={styles.candidateName}>{candidate.name}</h3>
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
            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
            placeholder="Введіть ім'я..."
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && (
            <span className={styles.errorText}>{errors.firstName}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Прізвище</label>
          <input
            type="text"
            name="lastName"
            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
            placeholder="Введіть прізвище..."
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && (
            <span className={styles.errorText}>{errors.lastName}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>№ студентського квитка</label>
          <input
            type="text"
            name="studentId"
            className={`${styles.input} ${errors.studentId ? styles.inputError : ''}`}
            placeholder="Напр. 12345789"
            value={formData.studentId}
            onChange={handleInputChange}
          />
          {errors.studentId && (
            <span className={styles.errorText}>{errors.studentId}</span>
          )}
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className={styles.sectionTitle}>Оберіть свого кандидата</h2>

      {submitError && (
        <div className={styles.serverErrorBox}>{submitError}</div>
      )}

      <div className={styles.candidatesGrid}>
        {candidates.map((candidate) => {
          const isSelected = formData.candidateId === candidate.id;
          return (
            <div
              key={candidate.id}
              className={`${styles.candidateCard} ${styles.selectableCard} ${isSelected ? styles.selectableCardActive : ''}`}
              onClick={() => {
                setFormData({ ...formData, candidateId: candidate.id });
                setSubmitError(null);
              }}>
              <div className={styles.candidateImageWrapper}>
                <img
                  src={candidate.imageUrl}
                  alt={candidate.name}
                  className={styles.candidateImage}
                />
              </div>
              <h3 className={styles.candidateName}>{candidate.name}</h3>
              <p className={styles.candidateRole}>{candidate.role}</p>
              <button
                className={`${styles.selectButton} ${isSelected ? styles.selectButtonActive : ''}`}>
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
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.stepContent}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className={styles.footer}>
          <div className={styles.pagination}>
            {[1, 2, 3].map((num) => (
              <span
                key={num}
                className={step === num ? styles.pageActive : styles.pageNumber}
                onClick={() => {
                  if (num < step) setStep(num);
                  if (num > step && step === 2) handleNextStep();
                  if (num === 2 && step === 1) setStep(num);
                }}>
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
            <button
              className={styles.primaryButton}
              onClick={handleSubmit}
              disabled={isSubmitting}>
              {isSubmitting ? 'Обробка...' : 'Проголосувати'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
