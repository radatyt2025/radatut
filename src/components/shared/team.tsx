import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import styles from '@/css/team.module.css';

import { Button } from '../ui/button';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageSrc: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 2,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/hero.png',
  },
  {
    id: 3,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 4,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 5,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 6,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 7,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 8,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 9,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 10,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 11,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 12,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 13,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 14,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 15,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
  {
    id: 16,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    imageSrc: '/images/team-member.png',
  },
];

export const Team: React.FC = () => {
  const chunkedMembers: TeamMember[][] = [];
  for (let i = 0; i < teamMembers.length; i += 8) {
    chunkedMembers.push(teamMembers.slice(i, i + 8));
  }

  return (
    <section className={styles.section}>
      <div className={`${styles.circle} ${styles.circleLargeMiddle}`} />
      <div className={`${styles.circle} ${styles.circleMediumLeft}`} />
      <div className={`${styles.circle} ${styles.circleSmallLeft}`} />
      <div className={`${styles.circle} ${styles.circleTopRight}`} />
      <div className={`${styles.circle} ${styles.circleLargeRight}`} />

      <div className={styles.container}>
        <div className={styles.header}>
          <Button variant="outline" asChild>
            <Link href='/team'>Детальніше</Link>
          </Button>
          <h2 className={styles.title}>КОМАНДА</h2>
        </div>

        <div className={styles.carouselWrapper}>
          <Carousel opts={{ align: 'start' }} className={styles.carouselMain}>
            <CarouselContent className={styles.carouselContent}>
              {chunkedMembers.map((group, groupIndex) => (
                <CarouselItem key={groupIndex} className={styles.carouselItem}>
                  <div className={styles.gridContainer}>
                    {group.map(({ id, name, imageSrc, role }) => (
                      <Card key={id} className={styles.cardContainer}>
                        <CardContent className={styles.teamCard}>
                          <Image
                            src={imageSrc}
                            fill
                            alt={name}
                            className={styles.image}
                          />
                          <div className={styles.gradientOverlay} />
                          <div className={styles.cardContentOverlay}>
                            <h3 className={styles.memberName}>{name}</h3>
                            <p className={styles.memberRole}>{role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
