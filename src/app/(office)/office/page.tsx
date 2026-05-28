import { getServerSession } from 'next-auth';

import OfficeClient from '@/components/shared/office/office-client';
import { authOptions } from '@/constants/auth-options';
import { getDocuments } from '@/lib/action/documents';
import { getEvents } from '@/lib/action/events';
import { getTasks } from '@/lib/action/tasks';
import { getUpdates } from '@/lib/action/updates';

export default async function OfficePage() {
  const session = await getServerSession(authOptions);
  const currentUserFullName = session?.user?.fullName || '';
  
  const [fetchedTasks, fetchedEvents, fetchedDocs, fetchedUpdates] = await Promise.all([
    getTasks(),
    getEvents(),
    getDocuments(),
    getUpdates(),
  ]);

  const myTasks = fetchedTasks.filter(task => task.assigneeName === currentUserFullName);
  
  const tasksData = myTasks.slice(0, 3).map((task) => {
    let statusText = 'Нове';
    let statusClass = 'statusPlanned';

    if (task.status === 'IN_PROGRESS') {
      statusText = 'В процесі';
      statusClass = 'statusProgress'; 
    } else if (task.status === 'COMPLETED') {
      statusText = 'Завершено';
      statusClass = 'statusCompleted'; 
    }

    return {
      id: task.id,
      title: task.title,
      status: statusText,
      statusClass: statusClass,
      assigneeName: task.assigneeName,
    };
  });

  
  const eventsData = fetchedEvents.slice(0, 3).map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
  }));

  
  const documentsData = fetchedDocs.slice(0, 3).map((doc) => ({
    id: doc.id,
    title: doc.title,
    fileUrl: doc.fileUrl,
  }));

  
  const updatesData = fetchedUpdates.slice(0, 3).map((update) => {
    const titleText = update.actionType === 'TASK' 
      ? `${update.authorName} додав задачу` 
      : `${update.authorName} додав документ`;

    return {
      id: update.id,
      title: titleText,
      status: update.isViewed ? 'Переглянуто' : 'Нове',
      statusClass: update.isViewed ? 'statusCompleted' : 'statusPlanned',
    };
  });

  return (
    <main>
      
      <OfficeClient 
        tasksData={tasksData}
        eventsData={eventsData}
        documentsData={documentsData}
        updatesData={updatesData}
      />
    </main>
  );
}