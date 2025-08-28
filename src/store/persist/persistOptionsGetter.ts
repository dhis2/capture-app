import { getCustomStorage } from './storage/customStorageGetter';

export async function getPersistOptions() {
    return {
        storage: await getCustomStorage(),
        whitelist: ['offline', 'networkStatus'],
    };
}
