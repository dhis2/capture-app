/* eslint-disable complexity */
import isArray from 'd2-utilizr/lib/isArray';
import errorCreator from '../utils/errorCreator';

export default class StorageContainer {
    static errorMessages = {
        INVALID_NAME: 'A valid database name must be provided',
        NO_OBJECTSTORES_DEFINED: 'no objectStores defined',
        NO_ADAPTERS_PROVIDED: 'no adapters provided',
        NO_VALID_ADAPTERS_FOUND: 'no valid adapters found',
        INVALID_ADAPTER_PROVIDED: 'An invalid adapter was provided',
        INVALID_OBJECTSTORE: 'Specify a valid objectStore',
    };

    static isAdapterValid(Adapter) {
        const adapterMethods = 'open set setAll get getAll getKeys count contains remove removeAll close destroy'.split(' ');

        return adapterMethods.every(method => Adapter.prototype[method]);
    }

    constructor(name, adapters, objectStores) {
        if (!name) {
            throw new Error(StorageContainer.errorMessages.INVALID_NAME);
        }

        if (!objectStores || !isArray(objectStores) || objectStores.length === 0) {
            throw new Error(StorageContainer.errorMessages.NO_OBJECTSTORES_DEFINED);
        }

        if (!adapters || !isArray(adapters || adapters.length === 0)) {
            throw new Error(StorageContainer.errorMessages.NO_ADAPTERS_DEFINED);
        }

        const validAdapterFound = adapters.some((Adapter) => {
            if (!StorageContainer.isAdapterValid(Adapter)) {
                throw new Error(errorCreator(StorageContainer.errorMessages.INVALID_ADAPTER_PROVIDED)({ Adapter }));
            }
            if (Adapter.isSupported()) {
                this.adapter = new Adapter({ name, version: 1, objectStores, keyPath: 'id' });
                return true;
            }
            return false;
        });

        if (!validAdapterFound) {
            throw new Error(StorageContainer.errorMessages.NO_VALID_ADAPTERS_FOUND);
        }
    }

    open(...args) {
        return this.adapter.open(...args);
    }

    async set(store, dataObject) {
        await this.verifyStore(store, 'set');
        return this.adapter.set(store, dataObject);
    }

    async setAll(store, dataArray) {
        await this.verifyStore(store, 'setAll');
        return this.adapter.setAll(store, dataArray);
    }

    async get(store, key) {
        await this.verifyStore(store, 'get');
        return this.adapter.get(store, key);
    }

    async getAll(store, predicate) {
        await this.verifyStore(store, 'getAll');
        return this.adapter.getAll(store, predicate);
    }

    async getKeys(store) {
        await this.verifyStore(store, 'getKeys');
        return this.adapter.getKeys(store);
    }

    async remove(store, key) {
        await this.verifyStore(store, 'remove');
        return this.adapter.remove(store, key);
    }

    async removeAll(store) {
        await this.verifyStore(store, 'removeAll');
        return this.adapter.removeAll(store);
    }

    async contains(store, key) {
        await this.verifyStore(store, 'contains');
        return this.adapter.contains(store, key);
    }

    async count(store, key) {
        await this.verifyStore(store, 'count');
        return this.adapter.count(store, key);
    }

    close(...args) {
        return this.adapter.close(...args);
    }

    destory(...args) {
        return this.adapter.destroy(...args);
    }

    verifyStore(store, caller) {
        return new Promise((resolve, reject) => {
            if (!store || !this.adapter.objectStoreNames.includes(store)) {
                reject(errorCreator(StorageContainer.errorMessages.INVALID_OBJECTSTORE, ({ storageContainer: this, adapter: this.adapter, method: caller })));
                return;
            }
            resolve();
        });
    }
}
