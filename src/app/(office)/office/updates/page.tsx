import UpdatesClient from '@/components/shared/office/updates-client';
import { getUpdates } from '@/lib/action/updates';

export default async function UpdatesPage() {
  const updates = await getUpdates();

  return (
    <main>
      <UpdatesClient initialUpdates={updates} />
    </main>
  );
}