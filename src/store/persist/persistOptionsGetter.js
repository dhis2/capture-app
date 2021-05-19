// @flow
import { getCustomStorage } from './storage/customStorageGetter';

export function getPersistOptions() {
    return {
        storage: getCustomStorage(),
        whitelist: ['offline', 'networkStatus'],
    };
}
