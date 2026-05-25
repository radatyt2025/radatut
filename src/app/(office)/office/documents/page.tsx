import DocumentsClient from '@/components/shared/office/documents-client'; 
import { getDocuments } from '@/lib/action/documents';

export default async function DocumentsPage() {
  
  const documents = await getDocuments();

  return (
    <main>
      
      <DocumentsClient initialDocuments={documents} />
    </main>
  );
}