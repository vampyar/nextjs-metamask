// Note: add new wallet
type InjectedProviders = {
  isMetaMask?: true;
};

interface Window {
  ethereum: InjectedProviders & {
    on: <T = any>(action: string, args: (a: T) => void) => Promise<void> | void;
    on: (...args: any[]) => Promise<void> | void;
    removeListener: (...args: any[]) => void;
    removeAllListeners: (...args: any[]) => void;
    request<T = any>(args: any): Promise<T>;
  };
}
