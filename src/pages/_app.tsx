import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout';
import { FC, PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { MetaMaskProvider } from '@/hooks/useMetamask';

const Providers = () => {
  return (
    <>
      <Toaster position="bottom-center" />
    </>
  );
};

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Layout>{children}</Layout>
      <Providers />
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </MetaMaskProvider>
  );
}
