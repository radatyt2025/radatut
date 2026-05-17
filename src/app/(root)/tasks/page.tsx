import TasksClient from '@/components/shared/tasks-client';
import { getTasks, getUsers } from '@/lib/action/tasks';

export default async function TasksPage() {
  const tasks = await getTasks();
  const users = await getUsers();

  return (
    <TasksClient initialTasks={tasks} users={users} />
  );
}
