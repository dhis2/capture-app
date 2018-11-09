/* eslint-disable class-methods-use-this */
import isDefined from 'd2-utilizr/lib/isDefined';
import isArray from 'd2-utilizr/lib/isArray';
import errorCreator from '../utils/errorCreator';

class Indexer {
    constructor(name, objectStore, storage) {
        this.key = `${name}.${objectStore}.**index**`;
        this.storage = storage;
    }

    all() {
        let keyData = this.storage.getItem(this.key);

        if (keyData) {
            try {
                keyData = JSON.parse(keyData);
            } catch (error) {
                keyData = null;
            }
        }

        if (!keyData) {
            this.storage.setItem(this.key, JSON.stringify([]));
        }

        return JSON.parse(this.storage.getItem(this.key));
    }

    add(key) {
        const keyData = this.all();
        keyData.push(key);
        this.storage.setItem(this.key, JSON.stringify(keyData));
    }

    remove(key) {
        const keyData = this.all();
        if (keyData.includes(key)) {
            keyData.splice(keyData.indexOf(key), 1);
            this.storage.setItem(this.key, JSON.stringify(keyData));
        }
    }

    find(key) {
        const keyData = this.all();
        return keyData.indexOf(key);
    }

    exists(key) {
        const keyData = this.all();
        return keyData.indexOf(key) !== -1;
    }

    destroy() {
        this.storage.removeItem(this.key);
    }
}

class DomLocalStorageAdapter {
    static storage = window.localStorage;

    static adapterName = 'DomLocalStorageAdapter';

    static isSupported() {
        return !!DomLocalStorageAdapter.storage;
    }

    static errorMessages = {
        INVALID_STORAGE_OBJECT: 'Invalid storage object',
        SET_FAILED: 'Save to localStorage failed',
        INVALID_KEY: 'Key is invalid',
        KEY_BASED_COUNT_IS_NOT_SUPPORTED: 'Key based count is not supported by DomLocalStorageAdapter',
    };

    constructor(options) {
        this.indexer = {};

        this.name = options.name;
        this.version = options.version;
        this.objectStoreNames = options.objectStores;
        this.keyPath = options.keyPath;
    }

    open() {
        return new Promise((resolve) => {
            this.objectStoreNames.forEach((store) => {
                this.indexer[store] = new Indexer(this.name, store, DomLocalStorageAdapter.storage);
            });
            resolve();
        });
    }

    set(store, dataObject) {
        return new Promise((resolve, reject) => {
            if (!isDefined(dataObject) || !isDefined(dataObject[this.keyPath])) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_STORAGE_OBJECT)({ adapter: this }));
                return;
            }

            const storeObject = JSON.parse(JSON.stringify(dataObject));
            const key = storeObject[this.keyPath];
            delete storeObject[this.keyPath];

            const storeKey = this.getStoreKey(store, key);
            if (!this.indexer[store].exists(storeKey)) {
                this.indexer[store].add(storeKey);
            }

            try {
                DomLocalStorageAdapter.storage.setItem(storeKey, JSON.stringify(storeObject));
                resolve();
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    setAll(store, dataArray) {
        if (!dataArray || !isArray(dataArray)) {
            return Promise.reject(errorCreator(DomLocalStorageAdapter.errorMessages.STORAGE_ARRAY_NOT_PROVIDED)({ adapter: this }));
        }
        const promises = dataArray.map(dataObject => this.set(store, dataObject));
        return Promise.all(promises);
    }

    get(store, key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
            }

            const storeObject = DomLocalStorageAdapter.storage.getItem(this.getStoreKey(store, key));

            if (storeObject) {
                const responseObject = JSON.parse(storeObject);
                responseObject[this.keyPath] = key;
                resolve(responseObject);
            }
            resolve();
        });
    }

    getAll(store, predicate) {
        const keys = this.indexer[store].all();
        const filtered = typeof predicate === 'function';

        const responseObjects = keys.reduce((accObjects, key) => {
            const storeObject = DomLocalStorageAdapter.storage.getItem(key);

            if (storeObject) {
                if (!filtered || predicate(storeObject)) {
                    const responseObject = JSON.parse(storeObject);
                    responseObject[this.keyPath] = this.mainKeyFromStoreKey(key, store);
                    accObjects.push(responseObject);
                }
            }

            return accObjects;
        }, []);

        return responseObjects;
    }

    getKeys(store) {
        const keys = this.indexer[store].all();
        return Promise.resolve(keys.map(key => this.mainKeyFromStoreKey(key, store)));
    }

    remove(store, key) {
        if (!key) {
            return Promise.reject(errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
        }

        const storeKey = this.getStoreKey(store, key);
        this.indexer[store].remove(storeKey);
        DomLocalStorageAdapter.storage.removeItem(storeKey);

        return Promise.resolve();
    }

    async removeAll(store) {
        const keys = await this.getKeys(store);
        return Promise.all(keys.map(key => this.remove(store, key)));
    }

    contains(store, key) {
        if (!key) {
            Promise.reject(errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
        }

        const storeKey = this.getStoreKey(store, key);
        return Promise.resolve(this.indexer[store].exists(storeKey));
    }

    count(store, key) {
        if (key) {
            Promise.reject(errorCreator(DomLocalStorageAdapter.errorMessages.KEY_BASED_COUNT_IS_NOT_SUPPORTED)({ adapter: this }));
        }

        return Promise.resolve(this.indexer[store].all().length);
    }

    close() {
        return Promise.resolve();
    }

    destroy() {
        this.objectStoreNames.forEach((store) => {
            this.removeAll(store);
            this.indexer[store].destroy();
        });
    }

    getStoreKey(store, key) {
        return `${this.name}.${store}.${key}`;
    }

    mainKeyFromStoreKey(storeKey, store) {
        return storeKey.replace(`${this.name}.${store}.`, '');
    }
}

export default DomLocalStorageAdapter;
