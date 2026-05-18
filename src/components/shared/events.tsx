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
import { eventsData } from '@/constants/home/events';
import styles from '@/css/events.module.css';
import { getEvents } from '@/lib/action/events';

export const Events: React.FC = async () => {
  const events = await getEvents();
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{eventsData.sectionTitle}</h2>
          <Button variant="outline">
            <Link href="/events">{eventsData.moreButton}</Link>
          </Button>
        </div>

        <div className={styles.sliderContainer}>
          <Carousel opts={{ align: 'start' }} className="w-full">
            <CarouselContent>
              {events.map((event) => (
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
                      {event.link && (
                        <Button className={styles.registerButton} asChild>
                          <a target="_blank" href={event.link}>
                            {event.buttonName}
                          </a>
                        </Button>
                      )}
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
