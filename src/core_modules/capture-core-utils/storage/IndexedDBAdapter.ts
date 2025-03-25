import isDefined from 'd2-utilizr/lib/isDefined';
import log from 'loglevel';
import { errorCreator } from '../errorCreator';

type IDBDatabase = {
    objectStoreNames: DOMStringList;
    version: number;
    close: () => void;
    onversionchange: (event: Event) => void;
    createObjectStore: (name: string) => IDBObjectStore;
    deleteObjectStore: (name: string) => void;
};

type IDBObjectStore = {
    get: (key: string) => IDBRequest;
    put: (value: unknown, key?: string) => IDBRequest;
    delete: (key: string) => IDBRequest;
    clear: () => IDBRequest;
    count: (key?: unknown) => IDBRequest;
    openCursor: () => IDBRequest;
};

type IDBRequest = {
    onsuccess: (event: Event) => void;
    onerror: (event: Event) => void;
    onblocked: (event: Event) => void;
    onupgradeneeded: (event: IDBVersionChangeEvent) => void;
    result: unknown;
    transaction: IDBTransaction;
};

type IDBTransaction = {
    objectStore: (name: string) => IDBObjectStore;
    oncomplete: () => void;
    onerror: (event: Event) => void;
    onabort: () => void;
    abort: () => void;
};

type IDBVersionChangeEvent = {
    target: {
        result: IDBDatabase;
        transaction: IDBTransaction;
    };
};

type IndexedDBAdapterOptions = {
    name: string;
    version: number;
    objectStores: string[];
    keyPath: string;
    onCacheExpired?: () => void;
};

type UpgradeCallbacks = {
    get: (store: string, key: string) => Promise<unknown>;
    isDowngrade?: boolean;
};

type UpgradeOptions = {
    onBeforeUpgrade?: (callbacks: UpgradeCallbacks) => Promise<void>;
    onAfterUpgrade?: (callbacks: { set: (store: string, data: unknown) => Promise<void> }) => Promise<void>;
    onCreateObjectStore?: (objectStore: IDBObjectStore, adapter: typeof IndexedDBAdapter) => void;
};

export class IndexedDBAdapter {
    static errorMessages = {
        OPEN_FAILED: 'open indexedDB failed',
        OPEN_BLOCKED: 'indexedDB blocked',
        OPEN_DATABASE_FIRST: 'Open database first',
        INVALID_STORAGE_OBJECT: 'Invalid storage object',
        STORAGE_ARRAY_NOT_PROVIDED: 'An array must be provided',
        SET_FAILED: 'Save to indexedDB failed',
        INVALID_KEY: 'Key is invalid',
        GET_FAILED: 'Get from indexedDB failed',
        GET_ALL_FAILED: 'Get All from indexedDB failed',
        GET_KEYS_FAILED: 'Get Keys from indexedDB failed',
        REMOVE_FAILED: 'Remove from indexedDB failed',
        REMOVE_ALL_FAILED: 'Remove all from indexedDB failed',
        CONTAINS_FAILED: 'Contains check from indexedDB failed',
        COUNT_FAILED: 'Count from indexedDB failed',
        CLOSE_FAILED: 'Close indexedDB failed',
        DESTROY_FAILED: 'Destroy indexedDB failed',
        DESTROY_BLOCKED: 'Destroy indexedDB blocked',
        CLOSE_FAILED_FROM_DESTROY: 'Close indexedDB failed from destroy',
    };

    static transactionMode = {
        READ_WRITE: 'readwrite',
        READ_ONLY: 'readonly',
    };

    static adapterName = 'IndexedDBAdapter';

    static indexedDB = window.indexedDB ||
        window.webkitIndexedDB ||
        window.mozIndexedDB ||
        window.oIndexedDB ||
        window.msIndexedDB;

    static iDBKeyRange = (() => {
        const range = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        return range ? range.bind(window) : null;
    })();

    static iDBTransaction = (() => {
        const trans = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        return trans ? trans.bind(window) : null;
    })();

    private name: string;
    private version: number;
    private objectStoreNames: string[];
    private keyPath: string;
    private onCacheExpired?: () => void;
    private db?: IDBDatabase;

    static isSupported(): boolean {
        return IndexedDBAdapter.indexedDB && IndexedDBAdapter.iDBKeyRange && IndexedDBAdapter.iDBTransaction;
    }

    static closeDB(db: IDBDatabase): void {
        db.close();
    }

    static destroyDB(name: string): Promise<Event> {
        return new Promise((resolve, reject) => {
            const request = IndexedDBAdapter.indexedDB.deleteDatabase(name);
            let wasBlocked = false;

            request.onsuccess = (e: Event) => {
                if (wasBlocked) {
                    return;
                }
                resolve(e);
            };

            request.onerror = (error: Event) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.DESTROY_FAILED)({ error }));
            };

            request.onblocked = (error: Event) => {
                wasBlocked = true;
                reject(errorCreator(IndexedDBAdapter.errorMessages.DESTROY_BLOCKED)({ error }));
            };
        });
    }

    static get(store: string, key: string, options: { project?: (obj: unknown) => unknown } | undefined, db: IDBDatabase, keyPath: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                let resultObject: unknown;
                tx = db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                tx.oncomplete = () => {
                    resolve(resultObject);
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)(
                        { aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = objectStore.get(key);
                request.onsuccess = (e: Event) => {
                    const object = (e.target as IDBRequest).result;
                    const { project } = options || {};

                    if (isDefined(object)) {
                        (object as Record<string, unknown>)[keyPath] = key;
                    }

                    resultObject = project ? project(object) : object;
                };
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ error }));
            }
        });
    }

    constructor(options: IndexedDBAdapterOptions) {
        this.name = options.name;
        this.version = options.version;
        this.objectStoreNames = options.objectStores;
        this.keyPath = options.keyPath;
        this.onCacheExpired = options.onCacheExpired;
    }

    private _upgrade(onCreateObjectStore?: (objectStore: IDBObjectStore, adapter: typeof IndexedDBAdapter) => void): void {
        if (this.db?.objectStoreNames) {
            const dbStoreNames = Array.from(this.db.objectStoreNames);
            dbStoreNames.forEach((name) => {
                this.db?.deleteObjectStore(name);
            });
        }

        this.objectStoreNames.forEach((name) => {
            const objectStore = this.db?.createObjectStore(name);
            if (objectStore) {
                onCreateObjectStore?.(objectStore, IndexedDBAdapter);
            }
        });
    }

    static facilitateDowngradeIfApplicable(name: string, version: number, keyPath: string, onBeforeUpgrade?: (callbacks: UpgradeCallbacks) => Promise<void>): Promise<boolean> {
        const preCheckRequest = IndexedDBAdapter.indexedDB.open(name);
        return new Promise((resolve, reject) => {
            preCheckRequest.onsuccess = (event: Event) => {
                const db = (event.target as IDBRequest).result as IDBDatabase;
                const foundVersion = db.version;
                db.onversionchange = () => {
                    db.close();
                };
                if (foundVersion > version) {
                    Promise.resolve()
                        .then(() => onBeforeUpgrade
                            && onBeforeUpgrade({
                                get: (store, key) => {
                                    if (!db.objectStoreNames.contains(store)) {
                                        return Promise.resolve(null);
                                    }
                                    return IndexedDBAdapter.get(store, key, undefined, db, keyPath);
                                },
                                isDowngrade: true,
                            }),
                        )
                        .then(() => {
                            IndexedDBAdapter.closeDB(db);
                            IndexedDBAdapter.destroyDB(name)
                                .then(() => {
                                    resolve(true);
                                })
                                .catch((error) => {
                                    log.error(errorCreator(IndexedDBAdapter.errorMessages.OPEN_FAILED)({ error }));
                                    reject(IndexedDBAdapter.errorMessages.OPEN_FAILED);
                                });
                        });
                } else {
                    IndexedDBAdapter.closeDB(db);
                    resolve(false);
                }
            };

            preCheckRequest.onerror = (error: Event) => {
                log.error(errorCreator(IndexedDBAdapter.errorMessages.OPEN_FAILED)({ error }));
                reject(IndexedDBAdapter.errorMessages.OPEN_FAILED);
            };
        });
    }

    async open({ onBeforeUpgrade, onAfterUpgrade, onCreateObjectStore }: UpgradeOptions): Promise<void> {
        const isDowngrade =
            await IndexedDBAdapter.facilitateDowngradeIfApplicable(
                this.name,
                this.version,
                this.keyPath,
                onBeforeUpgrade,
            );
        const request = IndexedDBAdapter.indexedDB.open(this.name, this.version);
        let wasBlocked = false;
        await new Promise<void>((resolve, reject) => {
            request.onsuccess = (event: Event) => {
                this.db = (event.target as IDBRequest).result as IDBDatabase;
                this.db.onversionchange = () => {
                    this.db.close();
                    this.db = undefined;
                    this.onCacheExpired?.();
                };
                resolve();
            };

            request.onerror = (error: Event) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.OPEN_FAILED)({ adapter: this, error }));
            };

            request.onblocked = (error: Event) => {
                wasBlocked = true;
                reject(errorCreator(IndexedDBAdapter.errorMessages.OPEN_BLOCKED)({ adapter: this, error }));
            };

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const tx = event.target.transaction;
                if (wasBlocked) {
                    tx.abort();
                    return;
                }

                this.db = event.target.result;
                this.db.onversionchange = () => {
                    this.db.close();
                    this.db = undefined;
                };

                return Promise.resolve()
                    .then(() => !isDowngrade && onBeforeUpgrade
                        && onBeforeUpgrade({
                            get: (store, key) => {
                                if (!this.db?.objectStoreNames.contains(store)) {
                                    return Promise.resolve(null);
                                }
                                return IndexedDBAdapter.get(store, key, undefined, this.db, this.keyPath);
                            },
                        }),
                    )
                    .then(() => {
                        this._upgrade(onCreateObjectStore);
                    })
                    .then(() => onAfterUpgrade
                        && onAfterUpgrade({
                            set: (store, data) => this.setForUpgrade(store, data, tx),
                        }),
                    );
            };
        });
    }

    private setForUpgrade(store: string, dataObject: Record<string, unknown>, tx: IDBTransaction): Promise<Record<string, unknown>> {
        return new Promise((resolve, reject) => {
            const storeObject = JSON.parse(JSON.stringify(dataObject));
            const key = storeObject[this.keyPath] as string;
            const objectStore = tx.objectStore(store);
            const request = objectStore.put(storeObject, key);
            request.onsuccess = () => {
                resolve(storeObject);
            };

            request.onerror = (error: Event) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            };
        });
    }

    async set(store: string, dataObject: Record<string, unknown>): Promise<void> {
        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                const storeObject = JSON.parse(JSON.stringify(dataObject));
                const key = storeObject[this.keyPath] as string;

                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(
                        errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)(
                            { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                objectStore.put(storeObject, key);
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                } else {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                }
            }
        });
    }

    async setAll(store: string, dataArray: Record<string, unknown>[]): Promise<void> {
        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                let storedCount = 0;
                const insertItem = () => {
                    if (storedCount < dataArray.length) {
                        const dataObject = dataArray[storedCount];
                        const storeObject = JSON.parse(JSON.stringify(dataObject));

                        if (!isDefined(storeObject) || !isDefined(storeObject[this.keyPath])) {
                            abortTx(new Error(errorCreator(IndexedDBAdapter.errorMessages.INVALID_STORAGE_OBJECT)(
                                { adapter: this })));
                        }

                        const key = storeObject[this.keyPath] as string;
                        const request = objectStore.put(storeObject, key);

                        request.onsuccess = () => {
                            storedCount += 1;
                            insertItem();
                        };
                    }
                };
                insertItem();
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    private getForUpgrade(store: string, key: string, tx: IDBTransaction): Promise<Record<string, unknown> | null> {
        return new Promise((resolve, reject) => {
            const objectStore = tx.objectStore(store);
            const request = objectStore.get(key);
            request.onsuccess = (e: Event) => {
                const object = (e.target as IDBRequest).result as Record<string, unknown>;

                if (isDefined(object)) {
                    object[this.keyPath] = key;
                }

                resolve(object);
            };

            request.onerror = (error: Event) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
            };
        });
    }

    async get(store: string, key: string, options?: { project?: (obj: unknown) => unknown }): Promise<Record<string, unknown> | null> {
        if (!this.db) {
            throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
        }
        return IndexedDBAdapter.get(store, key, options, this.db, this.keyPath) as Promise<Record<string, unknown> | null>;
    }

    private async _getAllInBatches(objectStore: IDBObjectStore, options: { predicate?: (obj: unknown) => boolean; project?: (obj: unknown) => unknown } | undefined, records: Record<string, unknown>[]): Promise<void> {
        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                tx = this.db?.transaction([objectStore.name], IndexedDBAdapter.transactionMode.READ_ONLY);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                this._getAllWithCursor(objectStore, options, records, abortTx);
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    private _getAllWithCursor(objectStore: IDBObjectStore, options: { predicate?: (obj: unknown) => boolean; project?: (obj: unknown) => unknown } | undefined, records: Record<string, unknown>[], abortTx: (error: Error) => void): void {
        const request = objectStore.openCursor();
        request.onsuccess = (e: Event) => {
            const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
            if (cursor) {
                const dbValue = cursor.value as Record<string, unknown>;
                this._processGetAllItem(dbValue, options?.predicate, options?.project, records);
                cursor.continue();
            }
        };
    }

    private _processGetAllItem(dbValue: Record<string, unknown>, predicate?: (obj: unknown) => boolean, project?: (obj: unknown) => unknown, records?: Record<string, unknown>[]): void {
        if (isDefined(dbValue)) {
            dbValue[this.keyPath] = (dbValue as Record<string, unknown>)[this.keyPath];
            if (!predicate || predicate(dbValue)) {
                records?.push(project ? project(dbValue) : dbValue);
            }
        }
    }

    async getAll(store: string, options?: { predicate?: (obj: unknown) => boolean; project?: (obj: unknown) => unknown }): Promise<Record<string, unknown>[]> {
        if (!this.db) {
            throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
        }

        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                const records: Record<string, unknown>[] = [];
                const objectStore = tx.objectStore(store);

                tx.oncomplete = () => {
                    resolve(records);
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                this._getAllInBatches(objectStore, options, records);
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    async getKeys(store: string): Promise<string[]> {
        if (!this.db) {
            throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
        }

        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                const keys: string[] = [];
                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve(keys);
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = objectStore.openCursor();

                request.onsuccess = (e: Event) => {
                    const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
                    if (cursor) {
                        keys.push(cursor.key as string);
                        cursor.continue();
                    }
                };
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)({ adapter: this, error }));
            }
        });
    }

    async remove(store: string, keys: string | string[]): Promise<void> {
        if (!this.db) {
            throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
        }

        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);

                if (Array.isArray(keys)) {
                    keys.forEach((key) => {
                        objectStore.delete(key);
                    });
                } else {
                    objectStore.delete(keys);
                }
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_FAILED)({ adapter: this, error }));
            }
        });
    }

    async removeAll(store: string): Promise<void> {
        if (!this.db) {
            throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
        }

        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_ALL_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_ALL_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                objectStore.clear();
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    async contains(store: string, key: string): Promise<boolean> {
        if (!this.db) {
            throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
        }

        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                let result = false;
                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve(result);
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = objectStore.get(key);

                request.onsuccess = (e: Event) => {
                    const object = (e.target as IDBRequest).result;
                    result = !!object;
                };
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)({ adapter: this, error }));
            }
        });
    }

    async count(store: string, options?: { onIDBGetRequest?: (objectStore: IDBObjectStore) => IDBRequest; query?: unknown }): Promise<number> {
        if (!this.db) {
            throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
        }

        return new Promise((resolve, reject) => {
            let tx: IDBTransaction | undefined;
            let catchError: Error | undefined;
            const abortTx = (error: Error) => {
                catchError = error;
                tx?.abort();
            };

            try {
                let result = 0;
                tx = this.db?.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                if (!tx) {
                    throw new Error(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST);
                }

                tx.oncomplete = () => {
                    resolve(result);
                };
                tx.onerror = (error: Event) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.COUNT_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.COUNT_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = options?.onIDBGetRequest
                    ? options.onIDBGetRequest(objectStore)
                    : objectStore.count(options?.query);

                request.onsuccess = (e: Event) => {
                    result = (e.target as IDBRequest).result as number;
                };
            } catch (error) {
                if (tx) {
                    abortTx(error as Error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.COUNT_FAILED)({ adapter: this, error }));
            }
        });
    }

    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve();
                return;
            }
            try {
                const db = this.db;
                IndexedDBAdapter.closeDB(db);
                this.db = undefined;
                resolve();
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.CLOSE_FAILED)({ adapter: this, error }));
            }
        });
    }

    async destroy(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.close()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(
                        errorCreator(
                            IndexedDBAdapter.errorMessages.CLOSE_FAILED_FROM_DESTROY)(
                            { adapter: this, error },
                        ),
                    );
                });
        });

        await IndexedDBAdapter.destroyDB(this.name);
    }

    isOpen(): boolean {
        return !!this.db;
    }
} 