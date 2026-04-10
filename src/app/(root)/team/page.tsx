import { Instagram, Send } from 'lucide-react';

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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s
          </p>
        </div>

        <div className={styles.list}>
          {teamMembers.map((member) => (
            <div key={member.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={member.imageSrc}
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
                      href={'https://instagram.com/markiyankostur'}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.socialLink}>
                      <Instagram size={18} strokeWidth={2} />
                      <span>markiyankostur</span>
                    </a>
                    <a
                      href={'https://t.me/markiyankostur'}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.socialLink}>
                      <Send size={18} strokeWidth={2} />
                      <span>markiyankostur</span>
                    </a>
                  </div>
                </div>

                <div className={styles.descriptionWrapper}>
                  <p className={styles.description}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry&apos;s
                    standard dummy text ever since the 1500s
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
