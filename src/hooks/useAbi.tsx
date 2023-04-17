import { useEffect, useMemo, useState } from 'react';
import tokensList from '@/constants/default-token-list.json';
import { AbiItem } from 'web3-utils';
import { useMetaMask } from '@/hooks/useMetamask';

export type TToken = (typeof tokensList)[0];
export interface IAbiItem extends TToken {
  abi: AbiItem;
}
const delay = (d: number) => new Promise((res) => setTimeout(res, d));
export const useAbis = () => {
  const { chainId } = useMetaMask();

  const [isLoading, setLoading] = useState(false);
  const [abis, setAbi] = useState<IAbiItem[]>([]);

  const fetchAbi = (address: string) => {
    return fetch('/api/abi', {
      method: 'POST',
      body: JSON.stringify({
        address,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  };

  const loomAbi = async (
    tokens: typeof tokensList,
    index: number,
    result: IAbiItem[] = [],
  ): Promise<IAbiItem[]> => {
    if (!tokens[index]) return Promise.resolve(result);
    const response = await fetchAbi(tokens[index].address);
    let abi = undefined;
    // Note: rate limit from API
    if (index % 2) await delay(2000);
    try {
      abi = JSON.parse(response.result);
    } catch (e) {}
    result.push({
      ...tokens[index],
      abi,
    });

    return loomAbi(tokens, ++index, result);
  };

  const tokenByChain = useMemo(
    () => tokensList.filter((e) => chainId?.slice(2) === e.chainId.toString()),
    [chainId],
  );

  useEffect(() => {
    setLoading(true);
    loomAbi(tokenByChain, 0, [])
      .then((tokens) => {
        setAbi(tokens);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tokenByChain]);

  return {
    abis,
    isLoading,
  };
};
