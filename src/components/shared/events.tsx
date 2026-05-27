import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { eventsData as eventsConstants } from '@/constants/home/events';
import styles from '@/css/events.module.css';
import { getEvents } from '@/lib/action/events';


const parseDate = (dateStr: string) => {
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  return new Date(dateStr); 
};

export const Events: React.FC = async () => {
  const events = await getEvents();
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{eventsConstants.sectionTitle}</h2>
          <Button variant="outline">
            <Link href="/events">{eventsConstants.moreButton}</Link>
          </Button>
        </div>

        <div className={styles.sliderContainer}>
          <Carousel opts={{ align: 'start' }} className="w-full">
            <CarouselContent>
              {events
                .filter((event) => event.type === 'INTERNAL') // Показуємо всі INTERNAL
                .map((event) => {
                  const eventDate = parseDate(event.date);
                  const isUpcoming = eventDate >= now;

                  return (
                    <CarouselItem key={event.id} className="basis-full">
                      <div className={styles.card}>
                        <div className={styles.imageWrapper}>
                          <img
                            src={event.imageUrl}
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
                          
                          {/* Кнопка відображається лише для майбутніх подій, у яких є посилання */}
                          {event.link && isUpcoming && (
                            <Button className={styles.registerButton} asChild>
                              <a target="_blank" rel="noreferrer" href={event.link}>
                                {event.buttonName || 'Детальніше'}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
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