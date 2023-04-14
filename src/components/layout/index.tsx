import React, { FC, PropsWithChildren } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
