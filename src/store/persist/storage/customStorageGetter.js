// @flow
import { getUserStorageController } from 'capture-core/storageControllers';
import { userStores } from 'capture-core/storageControllers/stores';

export default function getCustomStorage() {
    const store = userStores.REDUX_PERSIST;
    const storageController = getUserStorageController();

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

