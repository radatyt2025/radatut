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
import { getTeam } from '@/lib/get-team';
import { TeamMemberModel } from '@/models/team.model';

import { Button } from '../ui/button';

export const Team: React.FC = async () => {
  const teamMembers = await getTeam();

  const chunkedMembers: TeamMemberModel[][] = [];
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
            <Link href="/team">Детальніше</Link>
          </Button>
          <h2 className={styles.title}>КОМАНДА</h2>
        </div>

        <div className={styles.carouselWrapper}>
          <Carousel opts={{ align: 'start' }} className={styles.carouselMain}>
            <CarouselContent className={styles.carouselContent}>
              {chunkedMembers.map((group, groupIndex) => (
                <CarouselItem key={groupIndex} className={styles.carouselItem}>
                  <div className={styles.gridContainer}>
                    {group.map(({ id, fullName, imageSrc, role }) => (
                      <Card key={id} className={styles.cardContainer}>
                        <CardContent className={styles.teamCard}>
                          <Image
                            src={imageSrc}
                            fill
                            alt={fullName}
                            className={styles.image}
                          />
                          <div className={styles.gradientOverlay} />
                          <div className={styles.cardContentOverlay}>
                            <h3 className={styles.memberName}>{fullName}</h3>
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
