import { formatEther } from 'ethers';
import { useConnectedMetaMask } from '@/hooks/useMetamask';

export const Profile = () => {
  const { account, chainId, balance } = useConnectedMetaMask();
  return (
    <div className="flex flex-col text-gray-900">
      <div className="truncate max-md:w-44">Account: {account}</div>
      <div>Chain ID: {parseInt(chainId)}</div>
      <div>Amount: {formatEther(balance)}</div>
    </div>
  );
};
