// @flow
import getCustomStorage from './storage/customStorageGetter';

export default function getPersistOptions() {
  return {
    storage: getCustomStorage(),
    whitelist: ['offline', 'networkStatus'],
  };
}
