// @flow
import { getUserStorageController } from 'capture-core/storageControllers';
import { userStores } from 'capture-core/storageControllers/stores';

type StorageCallback<T> = (error: string | null, result: T | null) => void;

export function getCustomStorage() {
    const store = userStores.REDUX_PERSIST;
    const storageController = getUserStorageController();

    return {
        setItem: (key: string, value: unknown): void => storageController.set(store, {
            id: key,
            value,
        }),
        getItem: (key: string, onRetrieved: StorageCallback<unknown>): void => {
            storageController
                .get(store, key)
                .then((item) => {
                    onRetrieved(null, item?.value ?? null);
                })
                .catch((error) => {
                    onRetrieved(error, null);
                });
        },
        removeItem: (key: string): void => storageController.remove(store, key),
        getAllKeys: (onRetrieved: StorageCallback<string[]>): void => {
            storageController
                .getKeys(store)
                .then((keys) => {
                    onRetrieved(null, keys);
                })
                .catch((error) => {
                    onRetrieved(error, null);
                });
        },
    };
}

