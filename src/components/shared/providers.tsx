'use client';

import { Provider } from 'react-redux';

import { store } from '@/store/store.ts';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
};
