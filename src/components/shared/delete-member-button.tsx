'use client';

import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import styles from '@/css/add-team-member.module.css';
import { deleteTeamMember } from '@/lib/action/delete-team-member';

import { Button } from '../ui/button';

interface Props {
  id: string;
}

export const DeleteMemberButton: React.FC<Props> = ({ id }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTeamMember(id);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      size='icon'
      onClick={handleDelete}
      disabled={isPending}
      className={styles.deleteButton}
      aria-label="Delete member"
    >
      {isPending ? (
        <span className="animate-spin text-sm">⌛</span>
      ) : (
        <span className="text-sm leading-none"><Trash /></span>
      )}
    </Button>
  );
};