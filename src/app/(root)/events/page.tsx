import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import styles from '@/css/events/upcoming-events.module.css';

export default async function Events() {
  const eventsData = [
    {
      id: 1,
      title: 'Андріївські Вечорниці',
      date: '29.10.2025',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
      image: '/images/default.png',
    },
    {
      id: 2,
      title: 'Андріївські Вечорниці',
      date: '29.10.2025',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
      image: '/images/default.png',
    },
  ];
  return (
    <Container>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>МАЙБУТНІ ПОДІЇ</h2>

        <div className={styles.list}>
          {eventsData.map((event) => (
            <div key={event.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={event.image}
                  alt={event.title}
                  className={styles.image}
                />
              </div>

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <p className={styles.date}>{event.date}</p>
                <p className={styles.description}>{event.description}</p>

                <div className={styles.actions}>
                  <Button className={styles.primaryButton}>
                    Зареєструватися
                  </Button>
                  <Button className={styles.secondaryButton}>Детальніше</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
