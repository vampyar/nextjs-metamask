import { formatEther } from 'ethers';
import { useConnectedMetaMask } from '@/hooks/useMetamask';

export const Profile = () => {
  const { account, chainId, balance } = useConnectedMetaMask();

  return (
    <div className="flex flex-col text-amber-50">
      <div className="truncate max-md:w-60">Account: {account}</div>
      <div>Chain ID: {chainId}</div>
      <div>ETH: {formatEther(balance)}</div>
    </div>
  );
};
