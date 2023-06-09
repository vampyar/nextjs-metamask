import * as React from 'react';
import {
  IMetaMaskContext,
  MetaMaskState,
  MetamaskContext,
  AddEthereumChainParameter,
} from './metamask-context';
import { Action, reducer } from './reducer';
import { useSafeDispatch } from '../useSafeDispatch';
import { isSupportNetworks } from '@/utils/web3';

type ErrorWithCode = {
  code: number;
  [key: string]: any;
};
// MetaMask - RPC Error: Request of type 'wallet_requestPermissions' already pending for origin [origin]. Please wait.
const ERROR_CODE_REQUEST_PENDING = -32002;

type WindowInstanceWithEthereum = Window & typeof globalThis & { ethereum?: any };

function getMetaMaskProvider() {
  const ethereum = (window as WindowInstanceWithEthereum).ethereum;
  if (!ethereum) return null;
  if (Array.isArray(ethereum.providers)) {
    const metaMaskProvider = ethereum.providers.find((p: any) => p.isMetaMask && !p.isBraveWallet);
    if (metaMaskProvider) return metaMaskProvider;
    const braveWalletProvider = ethereum.providers.find(
      (p: any) => p.isMetaMask && p.isBraveWallet,
    );
    if (!braveWalletProvider) return null;
    return braveWalletProvider;
  }
  if (!ethereum.isMetaMask) return null;
  return ethereum;
}

function getSafeMetaMaskProvider() {
  const ethereum = getMetaMaskProvider();
  if (!ethereum) {
    throw new Error('MetaMask provider must be present in order to use this method');
  }
  return ethereum;
}

async function synchronize(dispatch: (action: Action) => void) {
  const ethereum = getMetaMaskProvider();
  if (!ethereum) {
    dispatch({ type: 'metaMaskUnavailable' });
    return;
  }

  const chainId: string = await ethereum.request({
    method: 'eth_chainId',
  });
  dispatch({ type: 'metaMaskNetworkNotSupported', payload: isSupportNetworks(chainId) });

  const accessibleAccounts: string[] = await ethereum.request({
    method: 'eth_accounts',
  });

  if (accessibleAccounts.length === 0) {
    dispatch({ type: 'metaMaskNotConnected', payload: { chainId } });
  } else {
    const balance: string = await ethereum.request({
      method: 'eth_getBalance',
      params: [accessibleAccounts[0], 'latest'],
    });

    dispatch({
      type: 'metaMaskConnected',
      payload: { accounts: accessibleAccounts, chainId, balance },
    });
  }
}

function subscribeToManualConnection(dispatch: (action: Action) => void) {
  const ethereum = getSafeMetaMaskProvider();
  const onAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) return;
    const chainId: string = await ethereum.request({
      method: 'eth_chainId',
    });
    dispatch({ type: 'metaMaskNetworkNotSupported', payload: isSupportNetworks(chainId) });
    const balance: string = await ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest'],
    });
    dispatch({
      type: 'metaMaskConnected',
      payload: {
        accounts,
        chainId,
        balance,
      },
    });
  };
  ethereum.on('accountsChanged', onAccountsChanged);
  return () => {
    ethereum.removeListener('accountsChanged', onAccountsChanged);
  };
}

function subsribeToAccountsChanged(dispatch: (action: Action) => void) {
  const ethereum = getSafeMetaMaskProvider();
  const onAccountsChanged = (accounts: string[]) =>
    dispatch({ type: 'metaMaskAccountsChanged', payload: accounts });
  ethereum.on('accountsChanged', onAccountsChanged);
  return () => {
    ethereum.removeListener('accountsChanged', onAccountsChanged);
  };
}

function subscribeToChainChanged(dispatch: (action: Action) => void, state: MetaMaskState) {
  const ethereum = getSafeMetaMaskProvider();
  const onChainChanged = async (chainId: string) => {
    dispatch({ type: 'metaMaskNetworkNotSupported', payload: isSupportNetworks(chainId) });
    dispatch({ type: 'metaMaskChainChanged', payload: chainId });
    const balance: string = await ethereum.request({
      method: 'eth_getBalance',
      params: [state.account, 'latest'],
    });
    dispatch({ type: 'metaMaskBalanceChanged', payload: balance });
  };
  ethereum.on('chainChanged', onChainChanged);
  return () => {
    ethereum.removeListener('chainChanged', onChainChanged);
  };
}

function requestAccounts(dispatch: (action: Action) => void): Promise<string[]> {
  const ethereum = getSafeMetaMaskProvider();

  dispatch({ type: 'metaMaskConnecting' });

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      const accounts = await ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length === 0) return;
      clearInterval(intervalId);
      const chainId: string = await ethereum.request({
        method: 'eth_chainId',
      });
      dispatch({ type: 'metaMaskNetworkNotSupported', payload: isSupportNetworks(chainId) });
      const balance: string = await ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      dispatch({ type: 'metaMaskConnected', payload: { accounts, chainId, balance } });
      resolve(accounts);
    }, 200);
    ethereum
      .request({
        method: 'eth_requestAccounts',
      })
      .then(async (accounts: string[]) => {
        clearInterval(intervalId);
        const chainId: string = await ethereum.request({
          method: 'eth_chainId',
        });
        const balance: string = await ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        dispatch({ type: 'metaMaskConnected', payload: { accounts, chainId, balance } });
        resolve(accounts);
      })
      .catch((err: unknown) => {
        if ('code' in (err as { [key: string]: any })) {
          if ((err as ErrorWithCode).code === ERROR_CODE_REQUEST_PENDING) return;
        }
        dispatch({ type: 'metaMaskPermissionRejected' });
        clearInterval(intervalId);
        reject(err);
      });
  });
}

async function addEthereumChain(parameters: AddEthereumChainParameter) {
  const ethereum = getSafeMetaMaskProvider();
  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [parameters],
    });
  } catch (err: unknown) {
    if ('code' in (err as { [key: string]: any })) {
      if ((err as ErrorWithCode).code === ERROR_CODE_REQUEST_PENDING) return;
    }
    throw err;
  }
}

async function switchEthereumChain(chainId: string) {
  const ethereum = getSafeMetaMaskProvider();
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (err: unknown) {
    if ('code' in (err as { [key: string]: any })) {
      if ((err as ErrorWithCode).code === ERROR_CODE_REQUEST_PENDING) return;
    }
    throw err;
  }
}

const initialState: MetaMaskState = {
  status: 'initializing',
  account: null,
  chainId: null,
  balance: null,
  isNetworkSupported: true,
};

export function MetaMaskProvider(props: any) {
  const [state, unsafeDispatch] = React.useReducer(reducer, initialState);
  const dispatch = useSafeDispatch(unsafeDispatch);

  const { status } = state;

  const isInitializing = status === 'initializing';
  React.useEffect(() => {
    if (isInitializing) {
      synchronize(dispatch);
    }
  }, [dispatch, isInitializing]);

  const isConnected = status === 'connected';
  React.useEffect(() => {
    if (!isConnected) return;
    const unsubscribe = subsribeToAccountsChanged(dispatch);
    return unsubscribe;
  }, [dispatch, isConnected]);

  const isAvailable = status !== 'unavailable' && status !== 'initializing';
  React.useEffect(() => {
    if (!isAvailable) return;
    const unsubscribe = subscribeToChainChanged(dispatch, state);
    return unsubscribe;
  }, [dispatch, isAvailable, state.account]);

  const isAvailableAndNotConnected = status === 'notConnected';
  React.useEffect(() => {
    if (!isAvailableAndNotConnected) return;
    const unsubscribe = subscribeToManualConnection(dispatch);
    return unsubscribe;
  }, [dispatch, isAvailableAndNotConnected]);

  const connect = React.useCallback(() => {
    if (!isAvailable) {
      console.warn(
        '`enable` method has been called while MetaMask is not available or synchronising. Nothing will be done in this case.',
      );
      return Promise.resolve([]);
    }
    return requestAccounts(dispatch);
  }, [dispatch, isAvailable]);

  const addChain = React.useCallback(
    (parameters: AddEthereumChainParameter) => {
      if (!isAvailable) {
        console.warn(
          '`addChain` method has been called while MetaMask is not available or synchronising. Nothing will be done in this case.',
        );
        return Promise.resolve();
      }
      return addEthereumChain(parameters);
    },
    [isAvailable],
  );

  const switchChain = React.useCallback(
    (chainId: string) => {
      if (!isAvailable) {
        console.warn(
          '`switchChain` method has been called while MetaMask is not available or synchronising. Nothing will be done in this case.',
        );
        return Promise.resolve();
      }
      return switchEthereumChain(chainId);
    },
    [isAvailable],
  );

  const checkTransactionConfirmation = React.useCallback(
    (txHash: string) => {
      if (!isAvailable) {
        console.warn(
          '`switchChain` method has been called while MetaMask is not available or synchronising. Nothing will be done in this case.',
        );
        return Promise.resolve();
      }
      const checkTransactionLoop = () => {
        const ethereum = getSafeMetaMaskProvider();
        try {
          return ethereum
            .request({ method: 'eth_getTransactionReceipt', params: [txHash] })
            .then((result: string | null) => {
              if (result != null) return 'confirmed';
              else return checkTransactionLoop();
            });
        } catch (err: unknown) {
          if ('code' in (err as { [key: string]: any })) {
            if ((err as ErrorWithCode).code === ERROR_CODE_REQUEST_PENDING) return;
          }
          throw err;
        }
      };
      return checkTransactionLoop();
    },
    [isAvailable],
  );

  const value: IMetaMaskContext = React.useMemo(
    () => ({
      ...state,
      connect,
      addChain,
      switchChain,
      checkTransactionConfirmation,
      ethereum: isAvailable ? getSafeMetaMaskProvider() : null,
    }),
    [connect, addChain, switchChain, state, isAvailable],
  );
  return <MetamaskContext.Provider value={value} {...props} />;
}
