import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMetaMask } from '@/hooks/useMetamask';
import { notify } from '@/utils/notify';
import { Profile } from '@/components/layout/profile';
import Image from 'next/image';
import cls from 'classnames';

const navigations = [
  {
    label: 'Assets',
    href: '/assets',
  },
  {
    label: 'Send Transaction',
    href: '/send',
  },
];

const Navigation = () => {
  const { isNetworkSupported } = useMetaMask();

  return (
    <>
      {navigations.map(({ href, label }, index) => (
        <li key={index}>
          <Link
            href={!isNetworkSupported ? '#' : href}
            className={cls([
              'block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-900 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 text-gray-400 lg:hover:text-gray-400 ',
              {
                'cursor-not-allowed': !isNetworkSupported,
              },
            ])}
            aria-disabled={true}
          >
            {label}
          </Link>
        </li>
      ))}
    </>
  );
};

export const Header = () => {
  const [toolbar, setToolbar] = useState(false);

  const { status, connect, isNetworkSupported } = useMetaMask();

  const isConnection = useMemo(() => status === 'connecting', [status]);
  const isConnected = useMemo(() => status === 'connected', [status]);
  const isNotInstalled = useMemo(() => status === 'unavailable', [status]);

  useEffect(() => {
    if (status === 'initializing') {
      notify(<div>Synchronisation with MetaMask ongoing...</div>);
    }
    if (status === 'unavailable') {
      notify(
        <div className="flex flex-row items-center ">
          <Image src="/metamask.svg" alt="metamask" width="50" height="50" />
          MetaMask not available :(
        </div>,
      );
    }
  }, [status]);

  useEffect(() => {
    if (isNetworkSupported === false) {
      notify(
        <div className="flex flex-row items-center ">
          <Image src="/metamask.svg" alt="metamask" width="50" height="50" />
          Network not supported
        </div>,
      );
    }
  }, [isNetworkSupported]);

  return (
    <header className="w-full">
      <nav className="bg-white border-gray-200 py-2.5">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" className="mr-3 sm:h-9" alt="Logo" width="90" height="50" />
          </Link>
          <div className="flex items-center lg:order-2">
            {isConnected ? (
              <Profile />
            ) : isNotInstalled ? (
              <Link
                href="https://metamask.io/"
                target="_blank"
                className="flex flex-row text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-purple-800"
              >
                <Image className="" src="/metamask.svg" alt="metamask" width="20" height="20" />
                Install Metamask
              </Link>
            ) : (
              <button
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-purple-800"
                onClick={connect}
              >
                {isConnection ? 'Connection...' : 'Connect to Wallet'}
              </button>
            )}

            <button
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
              onClick={() => setToolbar(!toolbar)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
              !toolbar && 'hidden'
            }`}
            id="mobile-menu-2"
          >
            <ul
              className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
              onClick={() => setToolbar(!toolbar)}
            >
              <li>
                <Link
                  href="/"
                  className="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0 text-white"
                  aria-current="page"
                >
                  News
                </Link>
              </li>
              {isConnected && <Navigation />}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
