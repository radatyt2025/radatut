import ElectionModal from '@/components/shared/dashboard/election-modal';

export default async function Page() {
  return (
    <ElectionModal
      electionId="123"
      candidates={[]}
    />
  );
}