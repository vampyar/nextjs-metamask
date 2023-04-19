import * as React from 'react';

export type AddEthereumChainParameter = {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
};

type MetaMaskInitializing = {
  isNetworkSupported: true;
  account: null;
  chainId: null;
  balance: null;
  status: 'initializing';
};

type MetaMaskUnavailable = {
  account: null;
  chainId: null;
  status: 'unavailable';
};

type MetaMaskNotConnected = {
  account: null;
  chainId: string;
  status: 'notConnected';
};

type MetaMaskConnecting = {
  account: null;
  chainId: string;
  status: 'connecting';
};

type MetaMaskConnected = {
  isNetworkSupported: boolean;
  account: string;
  chainId: string;
  balance: string;
  status: 'connected';
};

export type MetaMaskState =
  | MetaMaskInitializing
  | MetaMaskUnavailable
  | MetaMaskNotConnected
  | MetaMaskConnecting
  | MetaMaskConnected;

export type IMetaMaskContext = MetaMaskState & {
  isNetworkSupported?: boolean;
  /**
   * Connect the application to MetaMask
   * @returns Array of connected accounts when connection is successful, `null` if method not ready to be used
   */
  connect: () => Promise<string[] | null>;
  /**
   * Request addition of a new network
   * @param parameters New chain parameters, see [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) for full description
   */
  addChain: (parameters: AddEthereumChainParameter) => Promise<void>;
  /**
   * Request a switch of network
   * @param chainId Chain ID of the network in hexadecimal
   * @example ```ts
   * // Switch chain to Ethereum Mainnet
   * await context.switchChain("0x1");
   * ```
   */
  switchChain: (chainId: string) => Promise<void>;
  checkTransactionConfirmation: (txHash: string) => Promise<'confirmed'>;
  ethereum: {
    on: <T = any>(action: string, args: (a: T) => void) => Promise<void> | void;
    removeListener: (...args: any[]) => void;
    removeAllListeners: (...args: any[]) => void;
    request<T = any>(args: any): Promise<T>;
  };
};

export const MetamaskContext = React.createContext<IMetaMaskContext | undefined>(undefined);
