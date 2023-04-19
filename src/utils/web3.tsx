import Web3 from 'web3';
import { env } from '@/env.mjs';

export const web3utils = () => {
  const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`);
  return web3.utils;
};

export const convertAmountToEther = (amount: number): string => {
  return web3utils().toWei(amount.toString(), 'ether');
};

export const isSupportNetworks = (chainId: string) => {
  const networks = env.NEXT_PUBLIC_SUPPORTED_CHAINS.split(',');
  return networks.map(Number).includes(parseInt(chainId));
};
