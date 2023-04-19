import Web3 from 'web3';

export const web3utils = () => {
  const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`);
  return web3.utils;
};

export const convertAmountToEther = (amount: number): string => {
  return web3utils().toWei(amount.toString(), 'ether');
};
