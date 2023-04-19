import { MetaMaskState } from './metamask-context';

type MetaMaskUnavailable = {
  type: 'metaMaskUnavailable';
};
type MetaMaskNetworkNotSupported = {
  type: 'metaMaskNetworkNotSupported';
  payload: boolean;
};
type MetaMaskNotConnected = {
  type: 'metaMaskNotConnected';
  payload: {
    chainId: string;
  };
};
type MetaMaskConnected = {
  type: 'metaMaskConnected';
  payload: {
    accounts: string[];
    chainId: string;
    balance: string;
  };
};
type MetaMaskConnecting = {
  type: 'metaMaskConnecting';
};
type PermissionRejected = {
  type: 'metaMaskPermissionRejected';
};
type AccountsChanged = {
  type: 'metaMaskAccountsChanged';
  payload: string[];
};
type ChainChanged = {
  type: 'metaMaskChainChanged';
  payload: string;
};
type BalanceChanged = {
  type: 'metaMaskBalanceChanged';
  payload: string;
};

export type Action =
  | MetaMaskUnavailable
  | MetaMaskNotConnected
  | MetaMaskNetworkNotSupported
  | MetaMaskConnected
  | MetaMaskConnecting
  | PermissionRejected
  | AccountsChanged
  | ChainChanged
  | BalanceChanged;

export function reducer(state: MetaMaskState, action: Action): MetaMaskState {
  switch (action.type) {
    case 'metaMaskUnavailable':
      return {
        ...state,
        chainId: null,
        account: null,
        status: 'unavailable',
      };
    case 'metaMaskNotConnected':
      return {
        ...state,
        chainId: action.payload.chainId,
        account: null,
        status: 'notConnected',
      };
    case 'metaMaskConnected':
      const unlockedAccounts = action.payload?.accounts;
      return {
        chainId: action.payload.chainId,
        balance: action.payload.balance,
        account: unlockedAccounts[0] || '',
        isNetworkSupported: true,
        status: 'connected',
      };
    case 'metaMaskConnecting':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(
          `Invalid state transition from "${state.status}" to "connecting". Please, file an issue.`,
        );
        return state;
      }
      return {
        ...state,
        account: null,
        status: 'connecting',
      };
    case 'metaMaskPermissionRejected':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(
          `Invalid state transition from "${state.status}" to "connecting". Please, file an issue.`,
        );
        return state;
      }
      return {
        ...state,
        account: null,
        status: 'notConnected',
      };
    case 'metaMaskAccountsChanged':
      if (state.status !== 'connected') {
        console.warn(`Invalid accounts change in "${state.status}". Please, file an issue.`);
        return state;
      }
      const accounts = action.payload;
      if (accounts.length === 0) {
        return {
          ...state,
          account: null,
          status: 'notConnected',
        };
      }
      return {
        ...state,
        account: accounts[0] as string,
      };
    case 'metaMaskChainChanged':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(`Invalid chain ID change in "${state.status}". Please, file an issue.`);
        return state;
      }
      return {
        ...state,
        chainId: action.payload,
      };
    case 'metaMaskBalanceChanged':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(`Invalid balance change in "${state.status}". Please, file an issue.`);
        return state;
      }
      return {
        ...state,
        balance: action.payload,
      };
    case 'metaMaskNetworkNotSupported': {
      return {
        ...state,
        isNetworkSupported: action.payload,
      };
    }
    // no default
  }
}
