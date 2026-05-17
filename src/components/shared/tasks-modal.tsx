'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useTransition, useCallback } from 'react';
import { toast } from 'sonner';

import styles from '@/css/tasks-modal.module.css';
import { createTask } from '@/lib/action/tasks';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AddTaskModalProps {
  users: User[];
  onClose?: () => void;
}

export default function AddTaskModal({ users, onClose }: AddTaskModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    assigneeName: '',
    description: '',
  });

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('Файл не обрано');

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [onClose, router]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'dueDate') {
      const onlyNumbers = value.replace(/\D/g, '');
      
      let formattedDate = onlyNumbers;
      
      if (onlyNumbers.length > 2) {
        formattedDate = `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2)}`;
      }
      if (onlyNumbers.length > 4) {
        formattedDate = `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2, 4)}.${onlyNumbers.slice(4, 8)}`;
      }

      setFormData((prev) => ({ ...prev, [name]: formattedDate }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || formData.dueDate.length !== 10 || !formData.assigneeName) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля коректно');
      return;
    }

    startTransition(async () => {
      const response = await createTask({
        ...formData,
        attachmentFile: attachmentFile,
      });

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        handleClose();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Додавання задачі</h2>

        <div className={styles.formBody}>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Назва задачі</label>
              <input
                type="text"
                name="title"
                className={styles.input}
                placeholder="Введіть ім'я"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Дедлайн</label>
              <input
                type="text"
                name="dueDate"
                className={styles.input}
                placeholder="ДД.ММ.РРРР"
                maxLength={10}
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Пріоритет</label>
              <div className={styles.selectWrapper}>
                <select
                  name="priority"
                  className={styles.select}
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="LOW">Низький</option>
                  <option value="MEDIUM">Середній</option>
                  <option value="HIGH">Високий</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Відповідальний</label>
              <div className={styles.selectWrapper}>
                <select
                  name="assigneeName"
                  className={styles.select}
                  value={formData.assigneeName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Оберіть учасника</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.fullName}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Опис</label>
            <textarea
              name="description"
              className={styles.textarea}
              placeholder="Введіть опис..."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Додаткові файли</label>
            <label className={styles.fileWrapper}>
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <span className={styles.customFileBtn}>Оберіть файл</span>
              <span className={styles.fileName}>{fileName}</span>
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isPending}
            type="button"
          >
            {isPending ? 'Створення...' : 'Створити задачу'}
          </button>
        </div>
      </div>
    </div>
  );
}