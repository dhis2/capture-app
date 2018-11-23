/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
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

    constructor(options) {
        this.name = options.name;
        this.version = options.version || 1;
        this.objectStoreNames = options.objectStores;
        this.keyPath = options.keyPath;
        this.indexer = this.objectStoreNames
            .reduce((accIndexers, store) => {
                accIndexers[store] = new Indexer(this.name, store, DomLocalStorageAdapter.storage);
                return accIndexers;
            }, {});
        this.isOpened = false;
    }

    /*
        onBeforeUpgrade: a callback method, getting an object with a "get" property as argument. The "get" property can be used to retrieve something from Local Storage
        onAfterUpgrade: a callback method, getting an ojbect with a "set" property as argument. The "set" property can be used to set something in Local Storage
    */
    open(onBeforeUpgrade, onAfterUpgrade) {
        const versionKey = `${this.name}.${DomLocalStorageAdapter.CACHEVERSIONKEY}`;
        const inUseVersionString = DomLocalStorageAdapter.storage.getItem(versionKey);
        const inUseVersion = inUseVersionString && JSON.parse(inUseVersionString);
        this.isOpened = true;

        if (this.version !== inUseVersion) {
            return Promise.resolve()
                .then(() => onBeforeUpgrade
                    && onBeforeUpgrade({
                        get: this.get.bind(this),
                    }),
                )
                .then(() => {
                    this._executeDestroy();
                    DomLocalStorageAdapter.storage.setItem(versionKey, JSON.stringify(this.version));
                    return Promise.resolve();
                })
                .then(() => onAfterUpgrade && onAfterUpgrade({
                    set: this.set.bind(this),
                }));
        }
        return Promise.resolve();
    }

    _validatePrerequisitesForSet(store, dataObject) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return isOpenError;
        }

        if (!isDefined(dataObject) || !isDefined(dataObject[this.keyPath])) {
            return errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_STORAGE_OBJECT)({ adapter: this });
        }
        return null;
    }

    _executeSet(store, dataObject) {
        const storeObject = JSON.parse(JSON.stringify(dataObject));
        const key = storeObject[this.keyPath];
        delete storeObject[this.keyPath];

        const storeKey = this.getStoreKey(store, key);
        if (!this.indexer[store].exists(storeKey)) {
            this.indexer[store].add(storeKey);
        }

        DomLocalStorageAdapter.storage.setItem(storeKey, JSON.stringify(storeObject));
    }

    set(store, dataObject) {
        return new Promise((resolve, reject) => {
            const prerequisitesError = this._validatePrerequisitesForSet(store, dataObject);
            if (prerequisitesError) {
                reject(prerequisitesError);
                return;
            }

            try {
                this._executeSet(store, dataObject);
                resolve();
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    _validatePrerequisitesForSetAll(store, dataArray) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return isOpenError;
        }

        if (!dataArray || !isArray(dataArray)) {
            return errorCreator(DomLocalStorageAdapter.errorMessages.STORAGE_ARRAY_NOT_PROVIDED)({ adapter: this });
        }

        return null;
    }

    setAll(store, dataArray) {
        const prerequisitesError = this._validatePrerequisitesForSetAll(store, dataArray);
        if (prerequisitesError) {
            return Promise.reject(prerequisitesError);
        }

        try {
            dataArray.forEach((dataObject) => {
                this._executeSet(store, dataObject);
            });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    _validatePrerequisitesForGet(store, key) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return isOpenError;
        }

        if (!key) {
            return errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_KEY)({ adapter: this });
        }
        return null;
    }

    get(store, key) {
        return new Promise((resolve, reject) => {
            const prerequisitesError = this._validatePrerequisitesForGet(store, key);
            if (prerequisitesError) {
                reject(prerequisitesError);
                return;
            }

            const storeObject = DomLocalStorageAdapter.storage.getItem(this.getStoreKey(store, key));
            let responseObject;
            if (storeObject) {
                responseObject = JSON.parse(storeObject);
                responseObject[this.keyPath] = key;
            }
            resolve(responseObject);
        });
    }

    getAll(store, predicate) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return Promise.reject(isOpenError);
        }

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

        return Promise.resolve(responseObjects);
    }

    _executeGetKeys(store) {
        const keys = this.indexer[store].all();
        return keys
            .map(key => this.mainKeyFromStoreKey(key, store));
    }

    getKeys(store) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return Promise.reject(isOpenError);
        }
        return Promise.resolve(this._executeGetKeys(store));
    }

    _executeRemove(store, key) {
        const storeKey = this.getStoreKey(store, key);
        this.indexer[store].remove(storeKey);
        DomLocalStorageAdapter.storage.removeItem(storeKey);
    }

    remove(store, key) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return Promise.reject(isOpenError);
        }

        if (!key) {
            return Promise.reject(errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
        }

        this._executeRemove(store, key);

        return Promise.resolve();
    }

    _executeRemoveAll(store) {
        const keys = this._executeGetKeys(store);
        keys.forEach((key) => {
            this._executeRemove(store, key);
        });
    }

    removeAll(store) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return Promise.reject(isOpenError);
        }
        return Promise.resolve(this._executeRemoveAll(store));
    }

    contains(store, key) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return Promise.reject(isOpenError);
        }

        if (!key) {
            Promise.reject(errorCreator(DomLocalStorageAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
        }

        const storeKey = this.getStoreKey(store, key);
        return Promise.resolve(this.indexer[store].exists(storeKey));
    }

    count(store, key) {
        const isOpenError = this.validateIsOpened();
        if (isOpenError) {
            return Promise.reject(isOpenError);
        }

        if (key) {
            Promise.reject(
                errorCreator(DomLocalStorageAdapter.errorMessages.KEY_BASED_COUNT_IS_NOT_SUPPORTED)({ adapter: this }));
        }

        return Promise.resolve(this.indexer[store].all().length);
    }

    close() {
        this.isOpened = false;
        return Promise.resolve();
    }

    _executeDestroy() {
        this.objectStoreNames.forEach((store) => {
            this._executeRemoveAll(store);
            this.indexer[store].destroy();
        });
    }
    destroy() {
        this._executeDestroy();
        return Promise.resolve();
    }

    getStoreKey(store, key) {
        return `${this.name}.${store}.${key}`;
    }

    mainKeyFromStoreKey(storeKey, store) {
        return storeKey.replace(`${this.name}.${store}.`, '');
    }

    validateIsOpened() {
        return !this.isOpened
            ? errorCreator(DomLocalStorageAdapter.errorMessages.STORAGE_NOT_OPENED)({ adapter: this })
            : null;
    }
}

export default DomLocalStorageAdapter;
