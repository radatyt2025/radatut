export const dynamic = 'force-dynamic';

import { AddTeamMemberForm } from '@/components/shared/add-team-memeber-form';
import { DeleteMemberButton } from '@/components/shared/delete-member-button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import styles from '@/css/add-team-member.module.css';
import { getTeam } from '@/lib/get-team';
import { TeamMemberModel } from '@/models/team.model';

export default async function AddTeamMember() {
  const teamMembers = await getTeam();

  const chunkedMembers: TeamMemberModel[][] = [];
  for (let i = 0; i < teamMembers.length; i += 8) {
    chunkedMembers.push(teamMembers.slice(i, i + 8));
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.mainHeading}>
          Вітаємо у внутрішній системі студентської ради <br /> ІТ СТЕП
          Університету!
        </h1>

        <p className={styles.subHeading}>
          Ця система для роботи лише членів студентської ради :&#41;
        </p>

        <div className={styles.carouselWrapper}>
          <Carousel opts={{ align: 'start' }} className={styles.carouselMain}>
            <CarouselContent className={styles.carouselContent}>
              {chunkedMembers.map((group, groupIndex) => (
                <CarouselItem key={groupIndex} className={styles.carouselItem}>
                  <div className={styles.gridContainer}>
                    {group.map(({ id, fullName, imageSrc, role }) => (
                      <Card key={id} className={styles.cardContainer}>
                        <CardContent className={styles.teamCard}>
                          <img
                            src={imageSrc}
                            alt={fullName}
                            className={styles.image}
                          />
                          <div className={styles.gradientOverlay} />
                          <div className={styles.cardContentOverlay}>
                            <h3 className={styles.memberName}>{fullName}</h3>
                            <p className={styles.memberRole}>{role}</p>
                          </div>
                          <DeleteMemberButton id={id} />
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
        <AddTeamMemberForm />
      </div>
    </section>
  );
}
