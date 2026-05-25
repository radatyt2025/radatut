'use client';

import { useState } from 'react';

import styles from '@/css/office/updates.module.css';

type UpdateModel = {
  id: string;
  actionType: string;
  authorName: string;
  targetName: string | null;
  entityTitle: string | null;
  isViewed: boolean;
  createdAt: Date;
};

interface UpdatesClientProps {
  initialUpdates: UpdateModel[];
}

export default function UpdatesClient({ initialUpdates }: UpdatesClientProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'VIEWED' | 'UNVIEWED'>('ALL');

  
  const counts = {
    ALL: initialUpdates.length,
    NEW: initialUpdates.filter(u => !u.isViewed).length,
    VIEWED: initialUpdates.filter(u => u.isViewed).length,
    UNVIEWED: initialUpdates.filter(u => !u.isViewed).length,
  };

  const filteredUpdates = initialUpdates.filter((update) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'NEW' || activeTab === 'UNVIEWED') return !update.isViewed;
    if (activeTab === 'VIEWED') return update.isViewed;
    return true;
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>ОНОВЛЕННЯ</h1>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'ALL' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('ALL')}>
          Всі ({counts.ALL})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'NEW' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('NEW')}>
          Нові ({counts.NEW})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'VIEWED' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('VIEWED')}>
          Переглянуті ({counts.VIEWED})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'UNVIEWED' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('UNVIEWED')}>
          Не переглянуті ({counts.UNVIEWED})
        </button>
      </div>

      <div className={styles.listContainer}>
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map((update) => (
            <div key={update.id} className={styles.logCard}>
              <div className={styles.cardHeader}>
                <p className={styles.logText}>
                  <strong>{update.authorName}</strong>{' '}
                  {update.actionType === 'TASK' ? (
                    <>додав задачу <strong>{update.targetName}</strong>: &ldquo;{update.entityTitle}&rdquo;</>
                  ) : (
                    <>додав новий документ {update.entityTitle ? `"${update.entityTitle}"` : ''}</>
                  )}
                </p>
                
                <div className={styles.rightSide}>
                  <ArrowRightUpIcon />
                </div>
              </div>
              
              <div className={styles.cardFooter}>
                <div className={styles.dateWrapper}>
                  <CalendarIcon />
                  <span>{formatDate(update.createdAt)}</span>
                </div>
                {update.targetName && (
                  <span className={styles.responsibleText}>
                    Відповідальний: {update.targetName}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>Немає оновлень у цій категорії.</p>
        )}
      </div>
    </div>
  );
}


const ArrowRightUpIcon = () => (
  <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg className={styles.calendarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);