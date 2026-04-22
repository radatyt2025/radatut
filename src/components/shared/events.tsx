import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { eventsData } from '@/constants/home/events';
import styles from '@/css/events.module.css';

interface EventData {
  id: number;
  title: string;
  date: string;
  description: string;
  imageSrc: string;
}

const mockEvents: EventData[] = [
  {
    id: 1,
    title: 'Андріївські Вечорниці',
    date: '29.10.2025',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    imageSrc: '/images/events.png',
  },
  {
    id: 2,
    title: 'День Студента',
    date: '17.11.2025',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    imageSrc: '/images/events.png',
  },
];

export const Events: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{eventsData.sectionTitle}</h2>
          <Button variant="outline">{eventsData.moreButton}</Button>
        </div>

        <div className={styles.sliderContainer}>
          <Carousel opts={{ align: 'start' }} className="w-full">
            <CarouselContent>
              {mockEvents.map((event) => (
                <CarouselItem key={event.id} className="basis-full">
                  <div className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={event.imageSrc}
                        alt={event.title}
                        className={styles.image}
                      />
                    </div>

                    <div className={styles.contentWrapper}>
                      <div className={styles.textContent}>
                        <h3 className={styles.eventTitle}>{event.title}</h3>
                        <p className={styles.eventDate}>{event.date}</p>
                        <p className={styles.eventDescription}>
                          {event.description}
                        </p>
                      </div>
                      <Button className={styles.registerButton}>
                        {eventsData.registerButton}
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className={styles.controlsWrapper}>
              <CarouselPrevious className={styles.carouselControl} />
              <CarouselNext className={styles.carouselControl} />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
