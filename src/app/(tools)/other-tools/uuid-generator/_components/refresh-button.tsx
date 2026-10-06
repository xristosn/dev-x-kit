'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const RefreshPageButton: React.FC = () => {
  const { refresh } = useRouter();

  return (
    <Button data-testid="uuid-refresh-page" size="lg" onClick={() => refresh()}>
      Regenerate
    </Button>
  );
};
