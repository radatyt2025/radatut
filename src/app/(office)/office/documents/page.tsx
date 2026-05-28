import { getServerSession } from 'next-auth';

import DocumentsClient from '@/components/shared/office/documents-client';
import { authOptions } from '@/constants/auth-options';
import { getDocuments } from '@/lib/action/documents';

export default async function DocumentsPage() {
  const documents = await getDocuments();
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.role === 'ADMIN';
  return (
    <main>
      <DocumentsClient initialDocuments={documents} isAdmin={isAdmin} />
    </main>
  );
}
