import { Instagram, Send } from 'lucide-react';

import styles from '@/css/team-page.module.css';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  instagram: string;
  telegram: string;
  description: string;
  imageSrc: string;
}

const mockTeamMembers: TeamMember[] = Array(5)
  .fill({
    id: 0,
    name: 'Маркіян Костур',
    role: 'Голова студради',
    instagram: 'markiyankostur',
    telegram: 'markiyankostur',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    imageSrc: '/images/team-member.png',
  })
  .map((member, index) => ({ ...member, id: index + 1 }));

export default function Team() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Команда</h1>
          <p className={styles.subtitle}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s
          </p>
        </div>

        <div className={styles.list}>
          {mockTeamMembers.map((member) => (
            <div key={member.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={member.imageSrc}
                  alt={member.name}
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
                    <h2 className={styles.name}>{member.name}</h2>
                    <p className={styles.role}>{member.role}</p>
                  </div>

                  <div className={styles.socials}>
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.socialLink}>
                      <Instagram size={18} strokeWidth={2} />
                      <span>{member.instagram}</span>
                    </a>
                    <a
                      href={`https://t.me/${member.telegram}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.socialLink}>
                      <Send size={18} strokeWidth={2} />
                      <span>{member.telegram}</span>
                    </a>
                  </div>
                </div>

                <div className={styles.descriptionWrapper}>
                  <p className={styles.description}>{member.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
