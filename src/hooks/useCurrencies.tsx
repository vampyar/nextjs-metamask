import { useMemo } from 'react';
import tokens from '@/constants/default-token-list.json';
import { useMetaMask } from '@/hooks/useMetamask';

export const useCurrencies = () => {
  const { chainId } = useMetaMask();

  const currencies = useMemo(
    () => tokens.filter((e) => chainId && parseInt(chainId) === e.chainId),
    [chainId],
  );

  return { currencies };
};
