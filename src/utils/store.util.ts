export enum StoreKey {
  metamask = 'mm',
}

export const set = (key: StoreKey, value: string) => {
  window.localStorage.setItem(key, value);
};

export const get = (key: StoreKey) => {
  window.localStorage.getItem(key);
};

export const remove = (key: StoreKey) => {
  window.localStorage.removeItem(key);
};
