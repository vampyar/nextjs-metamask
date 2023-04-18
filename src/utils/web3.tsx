import Web3 from 'web3';

export const web3utils = () => {
  const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`);
  return web3.utils;
};

export const convertAmountToEther = (amount: string): string => {
  return web3utils().toWei(amount, 'ether');
};

console.log(convertAmountToEther('0.02'));
