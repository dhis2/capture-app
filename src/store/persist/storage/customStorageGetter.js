// @flow
import { getUserDataStorageController, USER_DATA_STORES } from 'capture-core/storageControllers';

export async function getCustomStorage() {
    const storageController = getUserDataStorageController();
    const store = USER_DATA_STORES.REDUX_PERSIST;

    return {
        setItem: (key: string, value: any) => storageController.set(store, {
            id: key,
            value,
        }),
        getItem: (key: string, onRetrieved: (err: ?string, item: ?Object) => void) => {
            storageController
                .get(store, key)
                .then((item) => {
                    onRetrieved(null, item && item.value);
                })
                .catch((error) => {
                    onRetrieved(error, null);
                });
        },
        removeItem: (key: string) => storageController.remove(store, key),
        getAllKeys: (onRetrieved: (err: ?string, keys: ?Array<string>) => void) => {
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

