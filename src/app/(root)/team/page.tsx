import { Instagram, Send } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import styles from '@/css/team-page.module.css';
import { getTeam } from '@/lib/get-team';

export default async function Team() {
  const teamMembers = await getTeam();
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Команда</h1>
          <p className={styles.subtitle}>
            Наша команда — це студенти з різними ідеями, навичками та досвідом,
            яких об’єднує бажання змінювати університет на краще.
          </p>
        </div>

        <div className={styles.list}>
          {teamMembers.map((member) => (
            <div key={member.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={member.imageUrl}
                  alt={member.fullName}
                  className={styles.image}
                />
                <div className={styles.mobileOverlay} />
              </div>

              <div className={styles.contentWrapper}>
                <div className={`${styles.circle} ${styles.circleLargeTop}`} />
                <div
                  className={`${styles.circle} ${styles.circleSmallBottom}`}
                />

                <div className={styles.infoWrapper}>
                  <div className={styles.textGroup}>
                    <h2 className={styles.name}>{member.fullName}</h2>
                    <p className={styles.role}>{member.role}</p>
                  </div>

                  <div className={styles.socials}>
                    <a
                      href={member.instagramLink}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.socialLink}>
                      <Instagram size={18} strokeWidth={2} />
                      <span>{member.instagramLink}</span>
                    </a>
                    <a
                      href={`https://web.telegram.org/k/#${member.telegramLink}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.socialLink}>
                      <Send size={18} strokeWidth={2} />
                      <span>{member.telegramLink}</span>
                    </a>
                  </div>
                </div>

                <div className={styles.descriptionWrapper}>
                  <p className={styles.description}>
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <Button asChild>
            <Link href="/dashboard/team-members">Додати Учасника</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
