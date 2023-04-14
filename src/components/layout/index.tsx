import React, { FC, PropsWithChildren } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      {children}
      <Footer />
    </div>
  );
};
