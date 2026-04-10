import React, { PropsWithChildren } from 'react';

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <section className="container">{children}</section>;
};
