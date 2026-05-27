import EventsClient from '@/components/shared/events/events-client';
import { getEvents } from '@/lib/action/events';

export default async function EventsPage() {
  
  const events = await getEvents();

  return (
    <main>
      <EventsClient initialEvents={events} />
    </main>
  );
}