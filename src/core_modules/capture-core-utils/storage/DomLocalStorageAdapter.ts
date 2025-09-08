import { errorCreator } from '../errorCreator';

class Indexer {
    key: any;
    storage: any;

    constructor(name: any, objectStore: any, storage: any) {
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

    add(key: any) {
        const keyData = this.all();
        keyData.push(key);
        this.storage.setItem(this.key, JSON.stringify(keyData));
    }

    remove(key: any) {
        const keyData = this.all();
        if (keyData.includes(key)) {
            keyData.splice(keyData.indexOf(key), 1);
            this.storage.setItem(this.key, JSON.stringify(keyData));
        }
    }

    find(key: any) {
        const keyData = this.all();
        return keyData.indexOf(key);
    }

    exists(key: any) {
        const keyData = this.all();
        return keyData.indexOf(key) !== -1;
    }

    destroy() {
        this.storage.removeItem(this.key);
    }
}

export class DomLocalStorageAdapter {
    name: any;
    version: any;
    objectStoreNames: any;
    keyPath: any;
    indexer: any;
    opened: any;

    static storage = window.localStorage;
    static adapterName = 'DomLocalStorageAdapter';
    static CACHEVERSIONKEY = '__VERSION__';

    static isSupported() {
        return !!DomLocalStorageAdapter.storage;
    }

    static errorMessages = {
        INVALID_STORAGE_OBJECT: 'Invalid storage object',
        SET_FAILED: 'Save to localStorage failed',
        INVALID_KEY: 'Key is invalid',
        KEY_BASED_COUNT_IS_NOT_SUPPORTED: 'Key based count is not supported by DomLocalStorageAdapter',
        STORAGE_NOT_OPENED: 'Please call open first in the DomLocalStorageAdapter',
    };

    constructor(options: any) {
        this.name = options.name;
        this.version = options.version || 1;
        this.objectStoreNames = options.objectStores;
        this.keyPath = options.keyPath;
        this.opened = false;
    }

    /*
        onBeforeUpgrade: a callback method, getting an object with a "get" property as argument. The "get" property can be used to retrieve something from Local Storage
        onAfterUpgrade: a callback method, getting an ojbect with a "set" property as argument. The "set" property can be used to set something in Local Storage
    */
    open(onBeforeUpgrade?: any, onAfterUpgrade?: any) {
        this.indexer = this.objectStoreNames
            .reduce((accIndexers, store) => {
                accIndexers[store] = new Indexer(this.name, store, DomLocalStorageAdapter.storage);
                return accIndexers;
            }, {});
        const versionKey = `${this.name}.${DomLocalStorageAdapter.CACHEVERSIONKEY}`;
        const inUseVersionString = DomLocalStorageAdapter.storage.getItem(versionKey);
        const inUseVersion = inUseVersionString && JSON.parse(inUseVersionString);
        this.opened = true;

        if (this.version !== inUseVersion) {
            return Promise.resolve(undefined)
                .then(() => onBeforeUpgrade
                    && onBeforeUpgrade({
                        get: this.get.bind(this),
                    }),
                )
                .then(() => {
                    // eslint-disable-next-line no-underscore-dangle
                    this._executeDestroy();
                    DomLocalStorageAdapter.storage.setItem(versionKey, JSON.stringify(this.version));
                    return Promise.resolve(undefined);
                })
                .then(() => onAfterUpgrade && onAfterUpgrade({
                    set: this.set.bind(this),
                }));
        }
        return Promise.resolve(undefined);
    }

    _executeSet(store: any, dataObject: any) {
        const storeObject = JSON.parse(JSON.stringify(dataObject));
        const key = storeObject[this.keyPath];
        delete storeObject[this.keyPath];

        const storeKey = this.getStoreKey(store, key);
        if (!this.indexer[store].exists(storeKey)) {
            this.indexer[store].add(storeKey);
        }

        DomLocalStorageAdapter.storage.setItem(storeKey, JSON.stringify(storeObject));
    }

    set(store: any, dataObject: any) {
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line no-underscore-dangle
                this._executeSet(store, dataObject);
                resolve(undefined);
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    setAll(store: any, dataArray: any) {
        try {
            dataArray.forEach((dataObject) => {
                // eslint-disable-next-line no-underscore-dangle
                this._executeSet(store, dataObject);
            });
            return Promise.resolve(undefined);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    get(store: any, key: any) {
        return new Promise((resolve) => {
            const storeObject = DomLocalStorageAdapter.storage.getItem(this.getStoreKey(store, key));
            let responseObject;
            if (storeObject) {
                responseObject = JSON.parse(storeObject);
                responseObject[this.keyPath] = key;
            }
            resolve(responseObject);
        });
    }

    getAll(store: any, options?: any) {
        const { predicate, project } = options || {};
        const keys = this.indexer[store].all();

        const responseObjects = keys.reduce((accObjects, key) => {
            const storeObject = DomLocalStorageAdapter.storage.getItem(key);

            if (storeObject) {
                if (!predicate || predicate(storeObject)) {
                    const responseObject = JSON.parse(storeObject);
                    responseObject[this.keyPath] = this.mainKeyFromStoreKey(key, store);
                    const value = project ? project(responseObject) : responseObject;
                    accObjects.push(value);
                }
            }

            return accObjects;
        }, []);

        return Promise.resolve(responseObjects);
    }

    _executeGetKeys(store: any) {
        const keys = this.indexer[store].all();
        return keys
            .map(key => this.mainKeyFromStoreKey(key, store));
    }

    getKeys(store: any) {
        // eslint-disable-next-line no-underscore-dangle
        return Promise.resolve(this._executeGetKeys(store));
    }

    _executeRemove(store: any, key: any) {
        const storeKey = this.getStoreKey(store, key);
        this.indexer[store].remove(storeKey);
        DomLocalStorageAdapter.storage.removeItem(storeKey);
    }

    remove(store: any, key: any) {
        // eslint-disable-next-line no-underscore-dangle
        this._executeRemove(store, key);
        return Promise.resolve(undefined);
    }

    _executeRemoveAll(store: any) {
        // eslint-disable-next-line no-underscore-dangle
        const keys = this._executeGetKeys(store);
        keys.forEach((key) => {
            // eslint-disable-next-line no-underscore-dangle
            this._executeRemove(store, key);
        });
    }

    removeAll(store: any) {
        // eslint-disable-next-line no-underscore-dangle
        return Promise.resolve(this._executeRemoveAll(store));
    }

    contains(store: any, key: any) {
        const storeKey = this.getStoreKey(store, key);
        return Promise.resolve(this.indexer[store].exists(storeKey));
    }

    count(store: any, key?: any) {
        if (key) {
            Promise.reject(
                errorCreator(DomLocalStorageAdapter.errorMessages.KEY_BASED_COUNT_IS_NOT_SUPPORTED)({ adapter: this }));
        }

        return Promise.resolve(this.indexer[store].all().length);
    }

    close() {
        this.opened = false;
        return Promise.resolve(undefined);
    }

    _executeDestroy() {
        this.objectStoreNames.forEach((store) => {
            // eslint-disable-next-line no-underscore-dangle
            this._executeRemoveAll(store);
            this.indexer[store].destroy();
        });
    }
    destroy() {
        this.opened = false;
        // eslint-disable-next-line no-underscore-dangle
        this._executeDestroy();
        return Promise.resolve(undefined);
    }

    isOpen() {
        return this.opened;
    }

    getStoreKey(store: any, key: any) {
        return `${this.name}.${store}.${key}`;
    }

    mainKeyFromStoreKey(storeKey: any, store?: any) {
        return storeKey.replace(`${this.name}.${store}.`, '');
    }
}
