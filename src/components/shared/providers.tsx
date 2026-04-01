'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import { store } from '@/store/store.ts';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <Provider store={store}>{children}</Provider>
        <Toaster
          position="top-right"
          style={
            {
              '--border-radius': 'calc(var(--radius) + 4px)',
            } as React.CSSProperties
          }
        />
      </SessionProvider>
    </>
  );
};
