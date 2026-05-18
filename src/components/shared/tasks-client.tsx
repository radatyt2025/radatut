'use client';

import { TrashIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import AddTaskModal from '@/components/shared/tasks-modal';
import styles from '@/css/tasks.module.css';
import {
  updateTaskStatus,
  addTaskComment,
  deleteTask,
} from '@/lib/action/tasks';

import { Container } from './container';

export type CommentModel = {
  id: string;
  authorName: string;
  text: string;
  createdAt: Date;
};

export type TaskModel = {
  id: string;
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
  assigneeName: string;
  description?: string | null;
  attachmentUrl?: string | null;
  comments?: CommentModel[];
};

export type UserModel = {
  id: string;
  fullName: string;
  email: string;
};

interface TasksClientProps {
  initialTasks: TaskModel[];
  users: UserModel[];
}

export default function TasksClient({ initialTasks, users }: TasksClientProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const currentUserFullName = session?.user?.fullName || 'Анонім';

  const [activeTab, setActiveTab] = useState<
    'ALL' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED'
  >('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
    null,
  );

  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [isPending, startTransition] = useTransition();

  const filteredTasks = initialTasks.filter((task) => {
    if (activeTab === 'ALL') return true;
    return task.status === activeTab;
  });

  const counts = {
    ALL: initialTasks.length,
    NEW: initialTasks.filter((t) => t.status === 'NEW').length,
    IN_PROGRESS: initialTasks.filter((t) => t.status === 'IN_PROGRESS').length,
    COMPLETED: initialTasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const toggleExpand = (id: string) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = (
    taskId: string,
    newStatus: TaskModel['status'],
  ) => {
    startTransition(async () => {
      const res = await updateTaskStatus(taskId, newStatus);
      if (res.success) toast.success('Статус оновлено');
      else toast.error(res.message);
    });
  };

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      const res = await deleteTask(taskId);
      if (res.success) toast.success('Задачу видалено');
      else toast.error(res.message);
    });
  };

  const handleAddComment = (taskId: string) => {
    const text = newComments[taskId];
    if (!text || text.trim() === '') return;

    startTransition(async () => {
      const res = await addTaskComment(taskId, currentUserFullName, text);
      if (res.success) {
        toast.success('Коментар додано');
        setNewComments((prev) => ({ ...prev, [taskId]: '' }));
      } else {
        toast.error(res.message);
      }
    });
  };

  const statusConfig = {
    NEW: 'Нове',
    IN_PROGRESS: 'В процесі',
    COMPLETED: 'Завершено',
  };

  return (
    <Container>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>МОЇ ЗАДАЧІ</h1>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.addTaskBtn}>
            Додати задачу
          </button>
        )}
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'ALL' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('ALL')}>
          Всі ({counts.ALL})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'NEW' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('NEW')}>
          Нові ({counts.NEW})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'IN_PROGRESS' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('IN_PROGRESS')}>
          В процесі ({counts.IN_PROGRESS})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'COMPLETED' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('COMPLETED')}>
          Завершені ({counts.COMPLETED})
        </button>
      </div>

      <div className={styles.taskList}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const isDropdownOpen = openStatusDropdown === task.id;

            const isAssignee = Boolean(
              currentUserFullName &&
              task.assigneeName &&
              currentUserFullName === task.assigneeName,
            );
            const canEditStatus = isAdmin || isAssignee;

            return (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <div className={styles.titleWrapper}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>

                    <div className={styles.customSelectContainer}>
                      <div
                        className={`${styles.statusWrapper} ${styles[`wrapper_${task.status}`]} ${!canEditStatus || isPending ? styles.statusDisabled : ''}`}
                        onClick={() => {
                          if (canEditStatus && !isPending) {
                            setOpenStatusDropdown(
                              isDropdownOpen ? null : task.id,
                            );
                          }
                        }}>
                        <div className={styles.statusVisible}>
                          <span>{statusConfig[task.status]}</span>
                          {canEditStatus && (
                            <div
                              style={{
                                transform: isDropdownOpen
                                  ? 'rotate(180deg)'
                                  : 'none',
                                transition: 'transform 0.2s',
                                display: 'flex',
                              }}>
                              <SmallChevronDownIcon />
                            </div>
                          )}
                        </div>
                      </div>

                      {isDropdownOpen && (
                        <>
                          <div
                            className={styles.dropdownOverlay}
                            onClick={() => setOpenStatusDropdown(null)}
                          />
                          <div className={styles.dropdownMenu}>
                            <button
                              className={`${styles.dropdownItem} ${styles.dropdownItem_NEW}`}
                              onClick={() => {
                                handleStatusChange(task.id, 'NEW');
                                setOpenStatusDropdown(null);
                              }}>
                              Нове
                            </button>
                            <button
                              className={`${styles.dropdownItem} ${styles.dropdownItem_IN_PROGRESS}`}
                              onClick={() => {
                                handleStatusChange(task.id, 'IN_PROGRESS');
                                setOpenStatusDropdown(null);
                              }}>
                              В процесі
                            </button>
                            <button
                              className={`${styles.dropdownItem} ${styles.dropdownItem_COMPLETED}`}
                              onClick={() => {
                                handleStatusChange(task.id, 'COMPLETED');
                                setOpenStatusDropdown(null);
                              }}>
                              Завершено
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={isPending}
                        title="Видалити задачу">
                        <TrashIcon />
                      </button>
                    )}
                  </div>

                  <button
                    className={styles.chevronBtn}
                    onClick={() => toggleExpand(task.id)}
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s',
                    }}>
                    <ChevronDownIcon />
                  </button>
                </div>

                <div className={styles.taskDetails}>
                  <div className={styles.detailItem}>
                    <CalendarIcon />
                    <span>{task.dueDate}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.assignee}>
                      Відповідальний: {task.assigneeName}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.expandedContent}>
                    {task.description && (
                      <p className={styles.taskDescription}>
                        {task.description}
                      </p>
                    )}
                    {task.attachmentUrl && (
                      <a
                        href={task.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.attachmentLink}>
                        <PaperclipIcon /> Переглянути файл
                      </a>
                    )}

                    <div className={styles.commentsSection}>
                      <h4 className={styles.commentsTitle}>Коментарі</h4>

                      <div className={styles.commentsList}>
                        {task.comments && task.comments.length > 0 ? (
                          task.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className={styles.commentItem}>
                              <span className={styles.commentAuthor}>
                                {comment.authorName}
                              </span>
                              <p className={styles.commentText}>
                                {comment.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className={styles.noComments}>
                            Ще немає коментарів
                          </p>
                        )}
                      </div>

                      <div className={styles.commentInputRow}>
                        <input
                          type="text"
                          placeholder="Написати коментар..."
                          className={styles.commentInput}
                          value={newComments[task.id] || ''}
                          onChange={(e) =>
                            setNewComments({
                              ...newComments,
                              [task.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleAddComment(task.id)
                          }
                        />
                        <button
                          className={styles.commentBtn}
                          onClick={() => handleAddComment(task.id)}
                          disabled={isPending || !newComments[task.id]}>
                          Надіслати
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className={styles.emptyState}>У цій категорії немає задач.</p>
        )}
      </div>

      {isModalOpen && (
        <AddTaskModal users={users} onClose={() => setIsModalOpen(false)} />
      )}
    </Container>
  );
}

const PriorityBadge = ({
  priority,
}: {
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}) => {
  const config = {
    HIGH: { text: 'Високий', className: styles.priorityHigh },
    MEDIUM: { text: 'Середній', className: styles.priorityMedium },
    LOW: { text: 'Низький', className: styles.priorityLow },
  };

  return (
    <span className={`${styles.priorityBadge} ${config[priority].className}`}>
      <ExclamationIcon />
      {config[priority].text}
    </span>
  );
};

const ChevronDownIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#002aff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SmallChevronDownIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ExclamationIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const PaperclipIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);
