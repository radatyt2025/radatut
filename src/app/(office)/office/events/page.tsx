import { getServerSession } from 'next-auth';

import ProfileEventsClient from '@/components/shared/events/profile-events-clients';
import { authOptions } from '@/constants/auth-options';
import { getEvents } from '@/lib/action/events';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.role === 'ADMIN';

  const events = await getEvents();
  return <ProfileEventsClient isAdmin={isAdmin} initialEvents={events} />;
}
