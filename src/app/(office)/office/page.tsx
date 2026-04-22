'use client';

import { signOut, useSession } from 'next-auth/react';

import { Container } from '@/components/shared/container';
import { officeLabels } from '@/constants/office/office';
import styles from '@/css/office/office.module.css';

type UserRole = 'CLIENT' | 'ADMIN';

export default function Office() {
  const { data: session, status } = useSession();

  const handleLogOut = () => {
    signOut({
      callbackUrl: '/',
    });
  };

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Адміністратор';
      case 'CLIENT':
        return 'Клієнт';
      default:
        return 'Гість';
    }
  };

  const tasksData = [
    {
      id: 1,
      title: 'Підготувати пост про донорство',
      status: 'В процесі',
      statusClass: 'statusProgress',
    },
    {
      id: 2,
      title: 'Зробити афішу',
      status: 'Заплановано',
      statusClass: 'statusPlanned',
    },
    {
      id: 3,
      title: 'Зробити афішу',
      status: 'Прострочено',
      statusClass: 'statusOverdue',
    },
  ];

  const eventsData = [
    { id: 1, title: 'Андріївські вечорниці', date: '12 квітня' },
    { id: 2, title: 'Зустріч команди', date: '13 квітня' },
  ];

  const documentsData = [{ id: 1, title: 'Протокол зустрічі' }];

  if (status === 'loading') {
    return (
      <Container>
        <div className={styles.wrapper}>{officeLabels.loading}</div>
      </Container>
    );
  }

  const userName = session?.user?.name || 'Користувач';
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'ADMIN';

  return (
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.greeting}>
            {officeLabels.greeting}, {isAdmin ? officeLabels.adminPrefix : ''}
            {userName}! 👋
          </h1>
          <p className={styles.role}>
            {officeLabels.rolePrefix}: <strong>{getRoleLabel(userRole)}</strong>
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{officeLabels.cards.tasks}</h2>
              <ArrowIcon />
            </div>
            <ul className={styles.list}>
              {tasksData.map((task) => (
                <li key={task.id} className={styles.listItem}>
                  <span className={styles.itemTitle}>{task.title}</span>
                  <span
                    className={`${styles.status} ${styles[task.statusClass]}`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{officeLabels.cards.events}</h2>
              <ArrowIcon />
            </div>
            <ul className={styles.list}>
              {eventsData.map((event) => (
                <li key={event.id} className={styles.listItem}>
                  <span className={styles.itemTitle}>{event.title}</span>
                  <span className={styles.date}>{event.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{officeLabels.cards.updates}</h2>
              <ArrowIcon />
            </div>
            <div className={styles.emptyState}>
              <p>{officeLabels.cards.docs}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{officeLabels.cards.docs}</h2>
              <ArrowIcon />
            </div>
            <ul className={styles.list}>
              {documentsData.map((doc) => (
                <li key={doc.id} className={styles.listItem}>
                  <div className={styles.docItemWrapper}>
                    <DocIcon />
                    <span className={styles.itemTitle}>{doc.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.logoutButton} onClick={handleLogOut}>
            <LogoutIcon />
            {officeLabels.logout}
          </button>
        </div>
      </div>
    </Container>
  );
}

const ArrowIcon = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);

const DocIcon = () => (
  <svg
    className={styles.docIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className={styles.logoutIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
