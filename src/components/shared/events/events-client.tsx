'use client';

import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import styles from '@/css/events/upcoming-events.module.css';

type EventModel = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
  type?: string | null; 
  link?: string | null; 
  buttonName?: string | null;
};

interface EventsClientProps {
  initialEvents: EventModel[];
}

const parseDate = (dateStr: string) => {
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  return new Date(dateStr); 
};

export default function EventsClient({ initialEvents }: EventsClientProps) {
  
  const internalEvents = initialEvents.filter(event => event.type === 'INTERNAL');

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const upcomingEvents = internalEvents.filter((event) => parseDate(event.date) >= now);
  const pastEvents = internalEvents.filter((event) => parseDate(event.date) < now);

  return (
    <Container>
      <div className={styles.wrapper}>
        
        {}
        <div className={styles.section}>
          <h2 className={styles.title}>МАЙБУТНІ ПОДІЇ</h2>
          <div className={styles.list}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img src={event.imageUrl} alt={event.title} className={styles.image} />
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{event.title}</h3>
                    <p className={styles.date}>{event.date}</p>
                    <p className={styles.description}>{event.description}</p>
                    <div className={styles.actions}>
                      {event.link && (
                        <Button className={styles.primaryButton}>
                          <a target="_blank" rel="noreferrer" href={event.link}>
                            {event.buttonName || 'Детальніше'}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>Немає запланованих внутрішніх подій.</p>
            )}
          </div>
        </div>

        
        <div className={styles.section}>
          <h2 className={styles.pastTitle}>МИНУЛІ ПОДІЇ</h2>
          <div className={styles.list}>
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <div key={event.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img src={event.imageUrl} alt={event.title} className={styles.image} />
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{event.title}</h3>
                    <p className={styles.date}>{event.date}</p>
                    <p className={styles.description}>{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>Немає минулих внутрішніх подій.</p>
            )}
          </div>
        </div>

      </div>
    </Container>
  );
}