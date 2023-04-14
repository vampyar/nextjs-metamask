export const chains = (chainId: string) => {
  if (!!Number(chainId) && chainId.length > 9) {
    return 'local';
  }
  switch (chainId) {
    case '1':
      return 'mainnet';
    case '3':
      return 'ropsten';
    default:
      return `unknown`;
  }
};
