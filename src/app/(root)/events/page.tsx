import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import styles from '@/css/events/upcoming-events.module.css';
import { getEvents } from '@/lib/action/events';

export default async function Events() {
  const events = await getEvents();
  return (
    <Container>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>МАЙБУТНІ ПОДІЇ</h2>

        <div className={styles.list}>
          {events.map((event) => (
            <div key={event.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className={styles.image}
                />
              </div>

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <p className={styles.date}>{event.date}</p>
                <p className={styles.description}>{event.description}</p>

                <div className={styles.actions}>
                  {event.link && (
                    <Button className={styles.primaryButton}>
                      <a target="_blank" href={event.link}>
                        {event.buttonName}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
