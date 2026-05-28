'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Container } from '@/components/shared/container';
import { officeLabels } from '@/constants/office/office';
import styles from '@/css/office/office.module.css';

type TaskDisplayModel = {
  id: string;
  title: string;
  status: string;
  statusClass: string;
  assigneeName?: string;
};

type EventsDisplayModel = {
  id: string;
  title: string;
  date: string;
};

type DocumentDisplayModel = {
  id: string;
  title: string;
  fileUrl: string;
};

type UpdateDisplayModel = {
  id: string;
  title: string;
  status: string;
  statusClass: string;
};

interface OfficeClientProps {
  tasksData: TaskDisplayModel[];
  eventsData: EventsDisplayModel[];
  documentsData: DocumentDisplayModel[];
  updatesData: UpdateDisplayModel[];
}

export default function OfficeClient({
  tasksData,
  eventsData,
  documentsData,
  updatesData,
}: OfficeClientProps) {
  const { data: session, status } = useSession();

  const handleLogOut = () => {
    signOut({
      callbackUrl: '/',
    });
  };

  if (status === 'loading') {
    return (
      <Container>
        <div className={styles.wrapper}>{officeLabels.loading}</div>
      </Container>
    );
  }

  const userName = session?.user?.fullName || 'Користувач';
  const userRole = session?.user?.role;
  const userTeam = session?.user?.team;
  const isAdmin = userRole === 'ADMIN';

  const myTasks = tasksData.filter(
    (task) => !task.assigneeName || task.assigneeName === session?.user?.fullName
  );

  return (
    <Container>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <h1 className={styles.greeting}>
            {officeLabels.greeting},{' '}
            {isAdmin ? officeLabels.adminPrefix + ' ' : ''}
            {userName}! 👋
          </h1>
          <div className={styles.userRoles}>
            <p className={styles.role}>
              {officeLabels.rolePrefix}{' '}
              <strong>{session?.user.position}</strong>
            </p>
            <p className={styles.role}>
              {officeLabels.teamPrefix} <strong>{userTeam}</strong>
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{officeLabels.cards.tasks}</h2>
              <Link href="/tasks" className={styles.arrowLink}>
                <ArrowIcon />
              </Link>
            </div>
            <ul className={styles.list}>
              {myTasks.length > 0 ? (
                myTasks.map((task) => (
                  <li key={task.id} className={styles.listItem}>
                    <span className={styles.itemTitle}>{task.title}</span>
                    <span
                      className={`${styles.status} ${styles[task.statusClass]}`}>
                      {task.status}
                    </span>
                  </li>
                ))
              ) : (
                <li className={styles.emptyState}>Немає активних задач</li>
              )}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                {officeLabels.cards.eventsManagement}
              </h2>
              <Link href="/office/events" className={styles.arrowLink}>
                <ArrowIcon />
              </Link>
            </div>
            <ul className={styles.list}>
              {eventsData.length > 0 ? (
                eventsData.map((event) => (
                  <li key={event.id} className={styles.listItem}>
                    <span className={styles.itemTitle}>{event.title}</span>
                    <span>{event.date}</span>
                  </li>
                ))
              ) : (
                <li className={styles.emptyState}>Немає найближчих подій</li>
              )}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{officeLabels.cards.docs}</h2>
              <Link href="/office/documents" className={styles.arrowLink}>
                <ArrowIcon />
              </Link>
            </div>
            <ul className={styles.list}>
              {documentsData.length > 0 ? (
                documentsData.map((doc) => (
                  <li key={doc.id} className={styles.listItem}>
                    <div className={styles.docItemWrapper}>
                      <DocIcon />
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                        <span className={styles.itemTitle}>{doc.title}</span>
                      </a>
                    </div>
                  </li>
                ))
              ) : (
                <li className={styles.emptyState}>Немає завантажених документів</li>
              )}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Оновлення</h2>
              <Link href="/office/updates" className={styles.arrowLink}>
                <ArrowIcon />
              </Link>
            </div>
            <ul className={styles.list}>
              {updatesData.length > 0 ? (
                updatesData.map((update) => (
                  <li key={update.id} className={styles.listItem}>
                    <span className={styles.itemTitle}>{update.title}</span>
                    <span
                      className={`${styles.status} ${styles[update.statusClass]}`}>
                      {update.status}
                    </span>
                  </li>
                ))
              ) : (
                <li className={styles.emptyState}>Немає нових оновлень</li>
              )}
            </ul>
          </div>
        </div>

        {isAdmin && (
          <div className={styles.adminSection}>
            <div className={styles.adminDivider}>
              <h3 className={styles.adminTitle}>Панель адміністратора</h3>
            </div>
            <div className={styles.grid}>
              
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    {officeLabels.cards.elections}
                  </h2>
                  <Link
                    href="/dashboard/elections"
                    className={styles.arrowLink}>
                    <ArrowIcon />
                  </Link>
                </div>
                <div className={styles.emptyState}>
                  <Link href="/dashboard/elections" className={styles.textLink}>
                    Перейти до виборів
                  </Link>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Учасники</h2>
                  <Link
                    href="/dashboard/team-members"
                    className={styles.arrowLink}>
                    <ArrowIcon />
                  </Link>
                </div>
                <div className={styles.emptyState}>
                  <Link
                    href="/dashboard/team-members"
                    className={styles.textLink}>
                    Керувати учасниками
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

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