import ProfileEventsClient from '@/components/shared/events/profile-events-clients';
import { getEvents } from '@/lib/action/events';

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <ProfileEventsClient 
      isAdmin={true} 
      initialEvents={events} 
    />
  );
}