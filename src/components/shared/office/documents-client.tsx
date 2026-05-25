'use client';

import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import styles from '@/css/office/documents.module.css';
import { createDocument, deleteDocument } from '@/lib/action/documents';

type DocumentModel = {
  id: string;
  title: string;
  fileUrl: string;
};

interface DocumentsClientProps {
  initialDocuments: DocumentModel[];
  isAdmin?: boolean; 
}

export default function DocumentsClient({
  initialDocuments,
  isAdmin = true,
}: DocumentsClientProps) {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !selectedFile) {
      toast.error('Будь ласка, введіть назву та оберіть файл');
      return;
    }

    startTransition(async () => {
      const res = await createDocument({
        title,
        file: selectedFile,
        authorName: session!.user.fullName,
      });
      if (res.success) {
        toast.success(res.message);
        setTitle('');
        setSelectedFile(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Видалити цей документ?')) return;
    startTransition(async () => {
      const res = await deleteDocument(id);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>ДОКУМЕНТИ</h1>

      <div className={styles.listContainer}>
        {initialDocuments.map((doc) => (
          <div key={doc.id} className={styles.docItem}>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.docLink}>
              <FileIcon />
              <span className={styles.docTitle}>{doc.title}</span>
            </a>

            {isAdmin && (
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  title="Видалити"
                  onClick={() => handleDelete(doc.id)}
                  disabled={isPending}>
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>
        ))}
        {initialDocuments.length === 0 && (
          <p className={styles.empty}>Немає завантажених документів</p>
        )}
      </div>

      {isAdmin && (
        <div className={styles.uploadSection}>
          <h2 className={styles.uploadTitle}>Новий документ</h2>

          <input
            type="text"
            placeholder="Назва документа"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />

          <div className={styles.inputGroup}>
            <label className={styles.fileWrapper}>
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={isPending}
              />
              <span className={styles.customFileBtn}>Оберіть файл</span>
              <span className={styles.fileName}>
                {selectedFile ? selectedFile.name : 'Файл не обрано'}
              </span>
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || !title || !selectedFile}>
            {isPending ? 'Завантаження...' : 'Додати на сайт'}
          </Button>
        </div>
      )}
    </div>
  );
}


const FileIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || styles.fileIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const TrashIcon = () => (
  <svg
    className={styles.trashIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
