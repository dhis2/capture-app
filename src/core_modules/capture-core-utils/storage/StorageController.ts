/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import isArray from 'd2-utilizr/lib/isArray';
import log from 'loglevel';
import { errorCreator } from '../errorCreator';
import { IndexedDBError } from './IndexedDBError/IndexedDBError';

type StorageAdapter = {
    isSupported: () => boolean;
    open: (...args: unknown[]) => Promise<void>;
    set: (store: string, dataObject: Record<string, unknown>) => Promise<void>;
    setAll: (store: string, dataArray: Record<string, unknown>[]) => Promise<void>;
    get: (store: string, key: string, options?: unknown) => Promise<unknown>;
    getAll: (store: string, options?: unknown) => Promise<unknown[]>;
    getKeys: (store: string) => Promise<string[]>;
    count: (store: string, key?: unknown) => Promise<number>;
    contains: (store: string, key: string) => Promise<boolean>;
    remove: (store: string, key: string) => Promise<void>;
    removeAll: (store: string) => Promise<void>;
    close: (...args: unknown[]) => Promise<void>;
    destroy: (...args: unknown[]) => Promise<void>;
    isOpen: () => boolean;
    name: string;
    version: number;
    objectStoreNames: string[];
    keyPath: string;
};

type StorageControllerOptions = {
    Adapters: typeof StorageAdapter[];
    objectStores: string[];
    onCacheExpired?: () => void;
};

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

    private name: string;
    private version: number;
    private Adapters: typeof StorageAdapter[];
    private AvailableAdapters: typeof StorageAdapter[];
    private adapter: StorageAdapter;
    private adapterType: typeof StorageAdapter;

    static isAdapterValid(Adapter: typeof StorageAdapter): boolean {
        const staticAdapterMethods = 'isSupported'.split(' ');
        const staticMethodsAvailable = staticAdapterMethods.every(method => Adapter[method]);
        if (!staticMethodsAvailable) {
            return false;
        }
        const adapterMethods = 'open set setAll get getAll getKeys count contains remove removeAll close destroy isOpen'.split(' ');
        return adapterMethods.every(method => Adapter.prototype[method]);
    }

    constructor(name: string, version: number, { Adapters, objectStores, onCacheExpired }: StorageControllerOptions) {
        if (!name) {
            throw new Error(StorageController.errorMessages.INVALID_NAME);
        }

        if (!Adapters || !isArray(Adapters) || Adapters.length === 0) {
            throw new Error(StorageController.errorMessages.NO_ADAPTERS_PROVIDED);
        }

        const ValidAdapters = Adapters
            .filter((Adapter) => {
                if (!StorageController.isAdapterValid(Adapter)) {
                    throw new IndexedDBError(
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

    getOpenStatusError(): Record<string, unknown> | null {
        return !this.adapter.isOpen()
            ? errorCreator(StorageController.errorMessages.STORAGE_NOT_OPEN)({ adapter: this.adapter })
            : null;
    }

    throwIfNotOpen(): void {
        const openError = this.getOpenStatusError();
        if (openError) {
            throw new IndexedDBError(
                errorCreator(
                    StorageController.errorMessages.STORAGE_NOT_OPEN)(
                    { adapter: this.adapter }),
            );
        }
    }

    throwIfStoreNotFound(store: string, caller: string): void {
        if (!store || !this.adapter.objectStoreNames.includes(store)) {
            throw new IndexedDBError(
                errorCreator(
                    StorageController.errorMessages.INVALID_OBJECTSTORE)(
                    { storageContainer: this, adapter: this.adapter, method: caller }),
            );
        }
    }

    throwIfDataObjectError = (dataObject: Record<string, unknown>): void => {
        if (!dataObject || !dataObject[this.adapter.keyPath]) {
            throw new IndexedDBError(
                errorCreator(StorageController.errorMessages.INVALID_STORAGE_OBJECT)({ adapter: this.adapter }),
            );
        }
    }

    throwIfDataArrayError(dataArray: Record<string, unknown>[]): void {
        if (!dataArray) {
            throw new IndexedDBError(
                errorCreator(StorageController.errorMessages.INVALID_STORAGE_ARRAY)({ adapter: this.adapter }),
            );
        }

        dataArray
            .forEach(this.throwIfDataObjectError);
    }

    private async _openFallbackAdapter(...args: unknown[]): Promise<void> {
        const currentAdapterIndex = this.AvailableAdapters.findIndex(AA => AA === this.adapterType);
        const nextAdapterIndex = currentAdapterIndex + 1;
        if (this.AvailableAdapters.length <= nextAdapterIndex) {
            throw new IndexedDBError(StorageController.errorMessages.OPEN_FAILED);
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

    async open(...args: unknown[]): Promise<void> {
        if (this.adapter.isOpen()) {
            throw new IndexedDBError(
                errorCreator(StorageController.errorMessages.STORAGE_ALREADY_OPEN)({ adapter: this.adapter }),
            );
        }
        const objectStores = this.adapter.objectStoreNames;
        if (!objectStores || !isArray(objectStores) || objectStores.length === 0) {
            throw new IndexedDBError(StorageController.errorMessages.NO_OBJECTSTORES_DEFINED);
        }

        try {
            await this.adapter.open(...args);
        } catch (error) {
            await this._openFallbackAdapter(...args);
        }
    }

    async set(store: string, dataObject: Record<string, unknown>): Promise<void> {
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

    async setAll(store: string, dataArray: Record<string, unknown>[]): Promise<void> {
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

    async get(store: string, key: string, options?: unknown): Promise<unknown> {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'get');

        if (!key) {
            throw Error(
                errorCreator(
                    StorageController.errorMessages.MISSING_KEY)(
                    { adapter: this.adapter, key, method: 'get' }),
            );
        }

        return this.adapter.get(store, key, options);
    }

    async getAll(store: string, options?: unknown): Promise<unknown[]> {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'getAll');
        return this.adapter.getAll(store, options);
    }

    async getKeys(store: string): Promise<string[]> {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'getKeys');
        return this.adapter.getKeys(store);
    }

    async remove(store: string, key: string): Promise<void> {
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

    async removeAll(store: string): Promise<void> {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'removeAll');
        return this.adapter.removeAll(store);
    }

    async contains(store: string, key: string): Promise<boolean> {
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

    async count(store: string, key?: unknown): Promise<number> {
        this.throwIfNotOpen();
        this.throwIfStoreNotFound(store, 'count');
        return this.adapter.count(store, key);
    }

    async close(...args: unknown[]): Promise<void> {
        return this.adapter.close(...args);
    }

    async destroy(...args: unknown[]): Promise<void> {
        return this.adapter.destroy(...args);
    }
} 