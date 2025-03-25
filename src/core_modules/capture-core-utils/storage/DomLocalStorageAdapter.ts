import { errorCreator } from '../errorCreator';

class Indexer {
    private key: string;
    private storage: Storage;

    constructor(name: string, objectStore: string, storage: Storage) {
        this.key = `${name}.${objectStore}.**index**`;
        this.storage = storage;
    }

    all(): string[] {
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

        return JSON.parse(this.storage.getItem(this.key) || '[]');
    }

    add(key: string): void {
        const keyData = this.all();
        keyData.push(key);
        this.storage.setItem(this.key, JSON.stringify(keyData));
    }

    remove(key: string): void {
        const keyData = this.all();
        if (keyData.includes(key)) {
            keyData.splice(keyData.indexOf(key), 1);
            this.storage.setItem(this.key, JSON.stringify(keyData));
        }
    }

    find(key: string): number {
        const keyData = this.all();
        return keyData.indexOf(key);
    }

    exists(key: string): boolean {
        const keyData = this.all();
        return keyData.indexOf(key) !== -1;
    }

    destroy(): void {
        this.storage.removeItem(this.key);
    }
}

export class DomLocalStorageAdapter {
    static storage = window.localStorage;
    static errorMessages = {
        INVALID_STORE_NAME: 'Invalid store name',
        SET_FAILED: 'Save to localStorage failed',
        GET_FAILED: 'Get from localStorage failed',
        REMOVE_FAILED: 'Remove from localStorage failed',
        REMOVE_ALL_FAILED: 'Remove all from localStorage failed',
        CONTAINS_FAILED: 'Contains check from localStorage failed',
        COUNT_FAILED: 'Count from localStorage failed',
        KEY_BASED_COUNT_IS_NOT_SUPPORTED: 'Key based count is not supported by DomLocalStorageAdapter',
    };

    private name: string;
    private version: number;
    private objectStoreNames: string[];
    private keyPath: string;
    private indexer: Indexer;

    static isSupported(): boolean {
        return !!window.localStorage;
    }

    constructor({ name, version, objectStores, keyPath }: { name: string; version: number; objectStores: string[]; keyPath: string }) {
        this.name = name;
        this.version = version;
        this.objectStoreNames = objectStores;
        this.keyPath = keyPath;
        this.indexer = new Indexer(name, objectStores[0], DomLocalStorageAdapter.storage);
    }

    async open(): Promise<void> {
        // No-op for localStorage
    }

    async set(store: string, dataObject: Record<string, unknown>): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this._executeSet(store, dataObject);
                resolve();
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    private _executeSet(store: string, dataObject: Record<string, unknown>): void {
        const key = dataObject[this.keyPath] as string;
        if (!key) {
            throw new Error('Invalid key');
        }
        const storeKey = `${this.name}.${store}.${key}`;
        DomLocalStorageAdapter.storage.setItem(storeKey, JSON.stringify(dataObject));
        this.indexer.add(key);
    }

    async get(store: string, key: string): Promise<Record<string, unknown> | null> {
        return new Promise((resolve, reject) => {
            try {
                const storeKey = `${this.name}.${store}.${key}`;
                const data = DomLocalStorageAdapter.storage.getItem(storeKey);
                resolve(data ? JSON.parse(data) : null);
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
            }
        });
    }

    async getAll(store: string): Promise<Record<string, unknown>[]> {
        return new Promise((resolve, reject) => {
            try {
                const keys = this.indexer.all();
                const results = keys.map(key => {
                    const storeKey = `${this.name}.${store}.${key}`;
                    const data = DomLocalStorageAdapter.storage.getItem(storeKey);
                    return data ? JSON.parse(data) : null;
                }).filter(Boolean) as Record<string, unknown>[];
                resolve(results);
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
            }
        });
    }

    async getKeys(store: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.indexer.all());
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
            }
        });
    }

    async remove(store: string, key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const storeKey = `${this.name}.${store}.${key}`;
                DomLocalStorageAdapter.storage.removeItem(storeKey);
                this.indexer.remove(key);
                resolve();
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.REMOVE_FAILED)({ adapter: this, error }));
            }
        });
    }

    async removeAll(store: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const keys = this.indexer.all();
                keys.forEach(key => {
                    const storeKey = `${this.name}.${store}.${key}`;
                    DomLocalStorageAdapter.storage.removeItem(storeKey);
                });
                this.indexer.destroy();
                resolve();
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.REMOVE_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    async contains(store: string, key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.indexer.exists(key));
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.CONTAINS_FAILED)({ adapter: this, error }));
            }
        });
    }

    async count(store: string, key?: unknown): Promise<number> {
        if (key) {
            throw Error(
                errorCreator(DomLocalStorageAdapter.errorMessages.KEY_BASED_COUNT_IS_NOT_SUPPORTED)({ adapter: this }),
            );
        }
        return new Promise((resolve, reject) => {
            try {
                resolve(this.indexer.all().length);
            } catch (error) {
                reject(errorCreator(DomLocalStorageAdapter.errorMessages.COUNT_FAILED)({ adapter: this, error }));
            }
        });
    }

    async close(): Promise<void> {
        // No-op for localStorage
    }

    async destroy(): Promise<void> {
        // No-op for localStorage
    }

    isOpen(): boolean {
        return true; // localStorage is always "open"
    }
} 