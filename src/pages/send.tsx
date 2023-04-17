import { useMetaMask } from '@/hooks/useMetamask';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SendCurrencies } from '@/components/send-currencies';

const SendPage = () => {
  // Note: Temporary solution for but for it case it using JWT strategy
  const { account } = useMetaMask();
  const { push } = useRouter();
  useEffect(() => {
    if (!account) {
      push('/');
    }
  }, [account, push]);

  return (
    <div className="flex flex-col w-full md:items-center">
      <SendCurrencies />
    </div>
  );
};

export default SendPage;
