'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import styles from '@/css/office/events.module.css';
import { deleteEvent } from '@/lib/action/events';
import { EventModel } from '@/models/event.model';

interface ProfileEventsProps {
  isAdmin?: boolean;
  initialEvents: EventModel[];
}

export default function ProfileEventsClient({
  isAdmin = true,
  initialEvents = [],
}: ProfileEventsProps) {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');

  const displayedEvents = initialEvents.filter(
    (event) => event.type === activeTab,
  );

  const handleDelete = async (id: string) => {
    const response = await deleteEvent(id);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Container>
      <div className={styles.wrapper}>
        <div
          className={`${styles.header} ${!isAdmin ? styles.headerCentered : ''}`}>
          <div className={styles.tabs}>
            <button
              className={
                activeTab === 'INTERNAL' ? styles.tabActive : styles.tabInactive
              }
              onClick={() => setActiveTab('INTERNAL')}>
              Внутрішні події
            </button>
            <button
              className={
                activeTab === 'EXTERNAL' ? styles.tabActive : styles.tabInactive
              }
              onClick={() => setActiveTab('EXTERNAL')}>
              Зовнішні події
            </button>
          </div>

          {isAdmin && (
            <Button className={styles.addButton} asChild>
              <Link href="/office/events/add-event">Додати подію</Link>
            </Button>
          )}
        </div>

        <div className={styles.list}>
          {displayedEvents.length > 0 ? (
            displayedEvents.map((event) => (
              <div key={event.id} className={styles.card}>
                
                {event.imageUrl && (
                  <div className={styles.imageWrapper}>
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className={styles.cardImage} 
                    />
                  </div>
                )}

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.titleGroup}>
                      <h3 className={styles.cardTitle}>{event.title}</h3>
                    </div>

                    {isAdmin && (
                      <div className={styles.adminActions}>
                        <button className={styles.iconButton} aria-label="Edit">
                          <EditIcon />
                        </button>
                        <button
                          className={styles.iconButton}
                          aria-label="Delete"
                          onClick={() => handleDelete(event.id)}>
                          <DeleteIcon />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className={styles.date}>{event.date}</p>
                  <p className={styles.description}>{event.description}</p>
                  
                  {event.link && (
                    <div className={styles.cardFooter}>
                      <Button className={styles.detailsButton} asChild>
                        <a target="_blank" href={event.link} rel="noreferrer">
                          {event.buttonName}
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
                
              </div>
            ))
          ) : (
            <p className={styles.emptyMessage}>Немає подій у цій категорії.</p>
          )}
        </div>
      </div>
    </Container>
  );
}

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);