import { getCustomStorage } from './storage/customStorageGetter';

interface PersistOptions {
  storage: unknown;
  whitelist: string[];
}

export function getPersistOptions(): PersistOptions {
  return {
    storage: getCustomStorage(),
    whitelist: ['offline', 'networkStatus'],
  };
}
