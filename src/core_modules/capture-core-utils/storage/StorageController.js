/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import isArray from 'd2-utilizr/lib/isArray';
import log from 'loglevel';
import { errorCreator } from '../errorCreator';

export class StorageController {
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
        OPEN_FAILED: 'Open storage failed',
        SET_FAILED: 'Could not save to cache',
        SET_ALL_FAILED: 'Could not save all to cache',
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

    constructor(name, version, { Adapters, objectStores, onCacheExpired }) {
        if (!name) {
            throw new Error(StorageController.errorMessages.INVALID_NAME);
        }

        if (!Adapters || !isArray(Adapters) || Adapters.length === 0) {
            throw new Error(StorageController.errorMessages.NO_ADAPTERS_DEFINED);
        }

        const ValidAdapters = Adapters
            .filter((Adapter) => {
                if (!StorageController.isAdapterValid(Adapter)) {
                    throw new Error(
                        errorCreator(StorageController.errorMessages.INVALID_ADAPTER_PROVIDED)({ Adapter }));
                }
                return Adapter.isSupported();
            });

        if (ValidAdapters.length <= 0) {
            throw new Error(StorageController.errorMessages.NO_VALID_ADAPTERS_FOUND);
        }

        this.name = name;
        this.version = version;
        this.Adapters = Adapters;
        this.AvailableAdapters = ValidAdapters;
        const CurrentAdapter = ValidAdapters[0];
        this.adapter = new CurrentAdapter({ name, version, objectStores, keyPath: 'id', onCacheExpired });
        this.adapterType = CurrentAdapter;
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

    async _openFallbackAdapter(...args) {
        const currentAdapterIndex = this.AvailableAdapters.findIndex(AA => AA === this.adapterType);
        const nextAdapterIndex = currentAdapterIndex + 1;
        if (this.AvailableAdapters.length <= nextAdapterIndex) {
            throw new Error(StorageController.errorMessages.OPEN_FAILED);
        }

        const Adapter = this.AvailableAdapters[nextAdapterIndex];
        const fallbackAdapter = new Adapter({
            name: this.adapter.name,
            version: this.adapter.version,
            objectStores: this.adapter.objectStoreNames,
            keyPath: 'id',
        });
        this.adapter = fallbackAdapter;
        this.adapterType = Adapter;
        await this.open(...args);
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

        try {
            await this.adapter.open(...args);
        } catch (error) {
            await this._openFallbackAdapter(...args);
        }
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
                log.error(
                    errorCreator(StorageController.errorMessages.SET_FAILED)(
                        { adapter: this.adapter, store, dataObject, error }));
                return Promise.reject(StorageController.errorMessages.SET_FAILED);
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
                log.error(
                    errorCreator(StorageController.errorMessages.SET_ALL_FAILED)(
                        { adapter: this.adapter, store, dataArray, error }));
                return Promise.reject(StorageController.errorMessages.SET_ALL_FAILED);
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
    async getAll(store, options) {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'getAll');
        return this.adapter.getAll(store, options);
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
