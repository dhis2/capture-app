/* eslint-disable complexity */
import isArray from 'd2-utilizr/lib/isArray';
import errorCreator from '../errorCreator';
import MemoryAdapter from './MemoryAdapter';

export default class StorageController {
    static errorMessages = {
        INVALID_NAME: 'A valid database name must be provided',
        NO_OBJECTSTORES_DEFINED: 'no objectStores defined',
        NO_ADAPTERS_PROVIDED: 'no adapters provided',
        NO_VALID_ADAPTERS_FOUND: 'no valid adapters found',
        INVALID_ADAPTER_PROVIDED: 'An invalid adapter was provided',
        INVALID_OBJECTSTORE: 'Specify a valid objectStore',
        STORAGE_NOT_OPEN: 'Please open storage first',
        STORAGE_ALREADY_OPEN: 'Storage is already open',
        INVALID_STORAGE_OBJECT: 'Invalid storage object',
        INVALID_STORAGE_ARRAY: 'Invalid storage array',
        MISSING_KEY: 'Please specifiy key',
    };

    static isAdapterValid(Adapter) {
        const staticAdapterMethods = 'isSupported'.split(' ');
        const staticMethodsAvailable = staticAdapterMethods.every(method => Adapter[method]);
        if (!staticMethodsAvailable) {
            return false;
        }
        const adapterMethods = 'open set setAll get getAll getKeys count contains remove removeAll close destroy isOpen'.split(' ');
        return adapterMethods.every(method => Adapter.prototype[method]);
    }

    constructor(name, version, adapters, objectStores, onFallback) {
        if (!name) {
            throw new Error(StorageController.errorMessages.INVALID_NAME);
        }
        this.name = name;
        this.onFallback = onFallback;

        if (!adapters || !isArray(adapters || adapters.length === 0)) {
            throw new Error(StorageController.errorMessages.NO_ADAPTERS_DEFINED);
        }

        const validAdapterFound = adapters.some((Adapter) => {
            if (!StorageController.isAdapterValid(Adapter)) {
                throw new Error(errorCreator(StorageController.errorMessages.INVALID_ADAPTER_PROVIDED)({ Adapter }));
            }
            if (Adapter.isSupported()) {
                this.adapter = new Adapter({ name, version, objectStores, keyPath: 'id' });
                this.adapterType = Adapter;
                return true;
            }
            return false;
        });

        if (!validAdapterFound) {
            throw new Error(StorageController.errorMessages.NO_VALID_ADAPTERS_FOUND);
        }
    }

    getOpenStatusError() {
        return !this.adapter.isOpen()
            ? errorCreator(StorageController.errorMessages.STORAGE_NOT_OPEN)({ adapter: this.adapter })
            : null;
    }

    throwIfNotOpen() {
        const openError = this.getOpenStatusError();
        if (openError) {
            throw Error(
                errorCreator(StorageController.errorMessages.STORAGE_NOT_OPEN)({ adapter: this.adapter }),
            );
        }
    }

    throwIfStoreNotFound(store, caller) {
        if (!store || !this.adapter.objectStoreNames.includes(store)) {
            throw Error(
                errorCreator(
                    StorageController.errorMessages.INVALID_OBJECTSTORE)(
                    { storageContainer: this, adapter: this.adapter, method: caller }),
            );
        }
    }

    throwIfDataObjectError = (dataObject) => {
        if (!dataObject || !dataObject[this.adapter.keyPath]) {
            throw Error(
                errorCreator(StorageController.errorMessages.INVALID_STORAGE_OBJECT)({ adapter: this.adapter }),
            );
        }
    }

    throwIfDataArrayError(dataArray) {
        if (!dataArray) {
            throw Error(
                errorCreator(StorageController.errorMessages.INVALID_STORAGE_ARRAY)({ adapter: this.adapter }),
            );
        }

        dataArray
            .forEach(this.throwIfDataObjectError);
    }

    async getBackupDataAsync() {
        const backupDataPromises = this.adapter.objectStoreNames
            .map(async (storeName) => {
                const storeData = await Promise.resolve().then(() => this.adapter.getAll(storeName));
                return storeData;
            });

        const backupDataArray = await Promise.all(backupDataPromises);
        return backupDataArray
            .reduce((accBackupData, dataObject, index) => {
                if (dataObject && dataObject.length > 0) {
                    accBackupData[this.adapter.objectStoreNames[index]] = dataObject;
                }
                return accBackupData;
            }, {});
    }

    restoreBackupDataAsync(backupData) {
        return Object
            .keys(backupData)
            .asyncForEach(storeName =>
                Promise.resolve().then(() => this.adapter.setAll(storeName, backupData[storeName])));
    }

    async fallbackToMemoryStorageAsync() {
        const backupData = await this.getBackupDataAsync();
        await Promise.resolve().then(() => this.adapter.destroy());
        await Promise.resolve().then(() => this.adapter.open());
        if (this.onFallback) {
            await this.onFallback({
                set: this.setWithoutFallback.bind(this),
            });
        }
        await Promise.resolve().then(() => this.adapter.close());

        this.adapter = new MemoryAdapter({
            name: this.adapter.name,
            version: this.adapter.version,
            objectStores: this.adapter.objectStoreNames,
            keyPath: 'id',
        });
        this.adapterType = MemoryAdapter;
        await Promise.resolve().then(() => this.adapter.open());
        await this.restoreBackupDataAsync(backupData);
    }

    // using async ensures that the the return value is wrapped in a promise
    async open(...args) {
        if (this.adapter.isOpen()) {
            throw new Error(
                errorCreator(StorageController.errorMessages.STORAGE_ALREADY_OPEN)({ adapter: this.adapter }),
            );
        }
        const objectStores = this.adapter.objectStoreNames;
        if (!objectStores || !isArray(objectStores) || objectStores.length === 0) {
            throw new Error(StorageController.errorMessages.NO_OBJECTSTORES_DEFINED);
        }

        return this.adapter.open(...args);
    }

    async setWithoutFallback(store, dataObject) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'set');
        this.throwIfDataObjectError(dataObject);
        return this.adapter.set(store, dataObject);
    }

    // using async ensures that the the return value is wrapped in a promise
    async set(store, dataObject) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'set');
        this.throwIfDataObjectError(dataObject);

        return Promise.resolve()
            .then(() => this.adapter.set(store, dataObject))
            .catch((error) => {
                if (this.adapterType === MemoryAdapter) {
                    return Promise.reject(error);
                }
                return this.fallbackToMemoryStorageAsync()
                    .then(() => this.adapter.set(store, dataObject));
            });
    }

    // using async ensures that the the return value is wrapped in a promise
    async setAll(store, dataArray) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'setAll');
        this.throwIfDataArrayError(dataArray);

        return Promise.resolve()
            .then(() => this.adapter.setAll(store, dataArray))
            .catch((error) => {
                if (this.adapterType === MemoryAdapter) {
                    return Promise.reject(error);
                }
                return this.fallbackToMemoryStorageAsync()
                    .then(() => this.adapter.setAll(store, dataArray));
            });
    }

    // using async ensures that the the return value is wrapped in a promise
    async get(store, key) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'get');

        if (!key) {
            throw Error(
                errorCreator(
                    StorageController.errorMessages.MISSING_KEY)(
                    { adapter: this.adapter, key, method: 'get' }),
            );
        }

        return this.adapter.get(store, key);
    }

    // using async ensures that the the return value is wrapped in a promise
    async getAll(store, predicate) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'getAll');
        return this.adapter.getAll(store, predicate);
    }

    // using async ensures that the the return value is wrapped in a promise
    async getKeys(store) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'getKeys');
        return this.adapter.getKeys(store);
    }

    // using async ensures that the the return value is wrapped in a promise
    async remove(store, key) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'remove');

        if (!key) {
            throw Error(
                errorCreator(
                    StorageController.errorMessages.MISSING_KEY)(
                    { adapter: this.adapter, key, method: 'remove' }),
            );
        }

        return this.adapter.remove(store, key);
    }

    // using async ensures that the the return value is wrapped in a promise
    async removeAll(store) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'removeAll');
        return this.adapter.removeAll(store);
    }

    // using async ensures that the the return value is wrapped in a promise
    async contains(store, key) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'contains');

        if (!key) {
            throw Error(
                errorCreator(
                    StorageController.errorMessages.MISSING_KEY)(
                    { adapter: this.adapter, key, method: 'contains' }),
            );
        }

        return this.adapter.contains(store, key);
    }

    // using async ensures that the the return value is wrapped in a promise
    async count(store, key) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'count');
        return this.adapter.count(store, key);
    }

    // using async ensures that the the return value is wrapped in a promise
    async close(...args) {
        return this.adapter.close(...args);
    }

    // using async ensures that the the return value is wrapped in a promise
    async destroy(...args) {
        return this.adapter.destroy(...args);
    }
}
