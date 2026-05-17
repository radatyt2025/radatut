
import { eq } from 'drizzle-orm';

import ElectionModal from '@/components/shared/dashboard/election-modal';

import { db } from '../../../../drizzle/drizzle-client';
import { candidates, elections } from '../../../../drizzle/schema.drizzle';

export default async function InterceptedElectionModalPage() {
  
  const activeElection = await db.query.elections.findFirst({
    where: eq(elections.isActive, true),
  });

  if (!activeElection) {
    return <div>Немає активних виборів (No active elections)</div>;
  }

  
  const electionCandidates = await db.query.candidates.findMany({
    where: eq(candidates.electionId, activeElection.id),
  });

  
  
  return (
    <ElectionModal 
      electionId={activeElection.id} 
      candidates={electionCandidates ?? []} 
    />
  );
}