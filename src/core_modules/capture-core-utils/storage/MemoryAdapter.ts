/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { errorCreator } from '../errorCreator';

export class MemoryAdapter {
    static errorMessages = {
        INVALID_STORE_NAME: 'Invalid store name',
        KEY_BASED_COUNT_IS_NOT_SUPPORTED: 'Key based count is not supported by DomLocalStorageAdapter',
    };

    private storage: Record<string, Set<Record<string, unknown>>>;

    static isSupported(): boolean {
        return true;
    }

    constructor({ objectStores }: { objectStores: string[] }) {
        this.storage = {};
        objectStores.forEach(storeName => {
            this.storage[storeName] = new Set();
        });
    }

    async open(): Promise<void> {
        // No-op for memory storage
    }

    async set(store: string, dataObject: Record<string, unknown>): Promise<void> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        this.storage[store].add(dataObject);
    }

    async setAll(store: string, dataArray: Record<string, unknown>[]): Promise<void> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        dataArray.forEach(dataObject => {
            this.storage[store].add(dataObject);
        });
    }

    async get(store: string, key: string): Promise<Record<string, unknown> | null> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        const dataObject = Array.from(this.storage[store]).find(obj => obj.id === key);
        return dataObject || null;
    }

    async getAll(store: string): Promise<Record<string, unknown>[]> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        return Array.from(this.storage[store]);
    }

    async getKeys(store: string): Promise<string[]> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        return Array.from(this.storage[store]).map(obj => obj.id as string);
    }

    async remove(store: string, key: string): Promise<void> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        const dataObject = Array.from(this.storage[store]).find(obj => obj.id === key);
        if (dataObject) {
            this.storage[store].delete(dataObject);
        }
    }

    async removeAll(store: string): Promise<void> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        this.storage[store].clear();
    }

    async contains(store: string, key: string): Promise<boolean> {
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        return Array.from(this.storage[store]).some(obj => obj.id === key);
    }

    async count(store: string, key?: unknown): Promise<number> {
        if (key) {
            throw Error(
                errorCreator(MemoryAdapter.errorMessages.KEY_BASED_COUNT_IS_NOT_SUPPORTED)({ adapter: this }),
            );
        }
        if (!this.storage[store]) {
            throw Error(errorCreator(MemoryAdapter.errorMessages.INVALID_STORE_NAME)({ adapter: this }));
        }
        return this.storage[store].size;
    }

    async close(): Promise<void> {
        // No-op for memory storage
    }

    async destroy(): Promise<void> {
        // No-op for memory storage
    }

    isOpen(): boolean {
        return true; // Memory storage is always "open"
    }
} 