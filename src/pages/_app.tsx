import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout';
import { FC, PropsWithChildren } from 'react';

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}
