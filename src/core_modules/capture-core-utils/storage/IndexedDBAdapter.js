import isDefined from 'd2-utilizr/lib/isDefined';
import log from 'loglevel';
import { errorCreator } from '../errorCreator';

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

    static isSupported() {
        return IndexedDBAdapter.indexedDB && IndexedDBAdapter.iDBKeyRange && IndexedDBAdapter.iDBTransaction;
    }

    static closeDB(db) {
        db.close();
    }

    static destroyDB(name) {
        return new Promise((resolve, reject) => {
            const request = IndexedDBAdapter.indexedDB.deleteDatabase(name);
            let wasBlocked = false;

            request.onsuccess = (e) => {
                if (wasBlocked) {
                    return;
                }
                resolve(e);
            };

            request.onerror = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.DESTROY_FAILED)({ error }));
            };

            request.onblocked = (error) => {
                wasBlocked = true;
                reject(errorCreator(IndexedDBAdapter.errorMessages.DESTROY_BLOCKED)({ error }));
            };
        });
    }

    static get(store, key, options, db, keyPath) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            try {
                let resultObject;
                tx = db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                tx.oncomplete = () => {
                    resolve(resultObject);
                };
                tx.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)(
                        { aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = objectStore.get(key);
                request.onsuccess = (e) => {
                    const object = e.target.result;
                    const { project } = options || {};

                    if (isDefined(object)) {
                        object[keyPath] = key;
                    }

                    resultObject = project ? project(object) : object;
                };
            } catch (error) {
                if (tx) {
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ error }));
            }
        });
    }

    constructor(options) {
        this.name = options.name;
        this.version = options.version;
        this.objectStoreNames = options.objectStores;
        this.keyPath = options.keyPath;
        this.onCacheExpired = options.onCacheExpired;
    }

    _upgrade(onCreateObjectStore) {
        if (this.db.objectStoreNames) {
            const dbStoreNames = Array.from(this.db.objectStoreNames);
            dbStoreNames.forEach((name) => {
                this.db.deleteObjectStore(name);
            });
        }

        this.objectStoreNames.forEach((name) => {
            const objectStore = this.db.createObjectStore(name);
            onCreateObjectStore && onCreateObjectStore(objectStore, IndexedDBAdapter);
        });
    }

    /**
     * Facilitate downgrade by destroying the current database if existing database version is greater than the requested version.
     * Data can be preserved through the onBeforeUpgrade callback function (will be called with the isDowngrade argument)
     * @param {*} onBeforeUpgrade
     * @returns Whether we are downgrading or not
     * @memberof IndexedDBAdapter
     */
    static facilitateDowngradeIfApplicable(name, version, keyPath, onBeforeUpgrade) {
        const preCheckRequest = IndexedDBAdapter.indexedDB.open(name);
        return new Promise((resolve, reject) => {
            preCheckRequest.onsuccess = (event) => {
                const foundVersion = event.target.result.version;
                const db = event.target.result;
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
                                    return IndexedDBAdapter.get(store, key, db, keyPath);
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

            preCheckRequest.onerror = (error) => {
                log.error(errorCreator(IndexedDBAdapter.errorMessages.OPEN_FAILED)({ error }));
                reject(IndexedDBAdapter.errorMessages.OPEN_FAILED);
            };
        });
    }
    /*
        onBeforeUpgrade: a callback method, getting an object with a "get" property as argument. The "get" property can be used to retrieve something from IndexedDB
        onAfterUpgrade: a callback method, getting an ojbect with a "set" property as argument. The "set" property can be used to set something in IndexedDB
    */
    async open(onBeforeUpgrade, onAfterUpgrade, onCreateObjectStore) {
        const isDowngrade =
            await IndexedDBAdapter.facilitateDowngradeIfApplicable(
                this.name,
                this.version,
                this.keyPath,
                onBeforeUpgrade,
            );
        const request = IndexedDBAdapter.indexedDB.open(this.name, this.version);
        let wasBlocked = false;
        await new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.db.onversionchange = () => {
                    this.db.close();
                    this.db = undefined;
                    this.onCacheExpired && this.onCacheExpired();
                };
                resolve();
            };

            request.onerror = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.OPEN_FAILED)({ adapter: this, error }));
            };

            request.onblocked = (error) => {
                wasBlocked = true;
                reject(errorCreator(IndexedDBAdapter.errorMessages.OPEN_BLOCKED)({ adapter: this, error }));
            };

            request.onupgradeneeded = (event) => {
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

                // eslint-disable-next-line consistent-return
                return Promise.resolve()
                    .then(() => !isDowngrade && onBeforeUpgrade
                        && onBeforeUpgrade({
                            get: (store, key) => {
                                if (!this.db.objectStoreNames.contains(store)) {
                                    return Promise.resolve(null);
                                }
                                return this.getForUpgrade(store, key, tx);
                            },
                        }),
                    )
                    .then(() => {
                        // eslint-disable-next-line no-underscore-dangle
                        this._upgrade(onCreateObjectStore);
                        return Promise.resolve();
                    })
                    .then(() => onAfterUpgrade && onAfterUpgrade({
                        set: (store, data) => this
                            .setForUpgrade(store, data, tx),
                    }));
            };
        });
    }

    setForUpgrade(store, dataObject, tx) {
        return new Promise((resolve, reject) => {
            const storeObject = JSON.parse(JSON.stringify(dataObject));
            const key = storeObject[this.keyPath];
            const objectStore = tx.objectStore(store);
            const request = objectStore.put(storeObject, key);
            request.onsuccess = () => {
                resolve(storeObject);
            };

            request.onerror = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            };
        });
    }

    set(store, dataObject) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            try {
                const storeObject = JSON.parse(JSON.stringify(dataObject));
                const key = storeObject[this.keyPath];

                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                tx.oncomplete = () => {
                    resolve(storeObject);
                };
                tx.onerror = (error) => {
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
                    abortTx(error);
                } else {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                }
            }
        });
    }

    setAll(store, dataArray) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            try {
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error) => {
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
                            abortTx(errorCreator(IndexedDBAdapter.errorMessages.INVALID_STORAGE_OBJECT)(
                                { adapter: this }));
                        }

                        const key = storeObject[this.keyPath];
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
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    getForUpgrade(store, key, tx) {
        return new Promise((resolve, reject) => {
            const objectStore = tx.objectStore(store);
            const request = objectStore.get(key);
            request.onsuccess = (e) => {
                const object = e.target.result;

                if (isDefined(object)) {
                    object[this.keyPath] = key;
                }

                resolve(object);
            };

            request.onerror = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
            };
        });
    }

    get(store, key, options) {
        return IndexedDBAdapter.get(store, key, options, this.db, this.keyPath);
    }

    // eslint-disable-next-line class-methods-use-this
    async _getAllInBatches(objectStore, options, records) {
        const { predicate, project, onIDBGetRequest, batchSize } = options || {};


        const executeRequest = keyRange =>
            new Promise((resolve) => {
                const request = onIDBGetRequest ?
                    onIDBGetRequest(objectStore, IndexedDBAdapter) :
                    objectStore.getAll(keyRange, batchSize);

                request.onsuccess = () => {
                    const values = request.result;
                    const count = values ? values.length : 0;
                    let lastId;
                    if (count > 0) {
                        values.forEach((value) => {
                            // eslint-disable-next-line no-underscore-dangle
                            this._processGetAllItem(value, predicate, project, records);
                        });
                        lastId = values[count - 1].id;
                    }
                    resolve({ count, lastId });
                };
            });

        let keyRange;
        let done = false;
        do {
            // eslint-disable-next-line no-await-in-loop
            const { count, lastId } = await executeRequest(keyRange);
            if (count < batchSize) {
                done = true;
            } else {
                keyRange = IDBKeyRange.lowerBound(lastId, true);
            }
        } while (!done);
    }

    _getAllWithCursor(objectStore, options, records, abortTx) {
        const { predicate, project, onIsAborted, onIDBGetRequest } = options || {};
        const request = onIDBGetRequest ?
            onIDBGetRequest(objectStore, IndexedDBAdapter) :
            objectStore.openCursor();

        request.onsuccess = (e) => {
            const isAborted = !!onIsAborted && onIsAborted();
            if (isAborted) {
                abortTx();
            } else {
                const cursor = e.target.result;
                if (cursor) {
                    cursor.value[this.keyPath] = cursor.primaryKey || cursor.key;
                    const dbValue = cursor.value;
                    // eslint-disable-next-line no-underscore-dangle
                    this._processGetAllItem(dbValue, predicate, project, records);
                    cursor.continue();
                }
            }
        };
    }

    // eslint-disable-next-line class-methods-use-this
    _processGetAllItem(dbValue, predicate, project, records) {
        if (!predicate || predicate(dbValue)) {
            const value = project ? project(dbValue) : dbValue;
            records.push(value);
        }
    }

    getAll(store, options) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };
            const { batchSize, isAborted } = options || {};

            try {
                const records = [];
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                const objectStore = tx.objectStore(store);
                batchSize ?
                    // eslint-disable-next-line no-underscore-dangle
                    this._getAllInBatches(objectStore, options, records, abortTx) :
                    // eslint-disable-next-line no-underscore-dangle
                    this._getAllWithCursor(objectStore, options, records, abortTx);

                tx.oncomplete = () => {
                    if (isAborted && isAborted()) {
                        reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)(
                            { adapter: this, aborted: true, error: catchError }));
                        return;
                    }
                    resolve(records);
                };

                tx.onerror = (error) => {
                    if (isAborted && isAborted()) {
                        reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)(
                            { adapter: this, aborted: true, error: catchError }));
                        return;
                    }
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
                };

                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };
            } catch (error) {
                if (tx) {
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    getKeys(store) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };
            try {
                const keys = [];
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                tx.oncomplete = () => {
                    resolve(keys);
                };
                tx.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = objectStore.openCursor();

                request.onsuccess = (e) => {
                    const cursor = e.target.result;

                    if (cursor) {
                        keys.push(cursor.key);
                        cursor.continue();
                    }
                };
            } catch (error) {
                if (tx) {
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)({ adapter: this, error }));
            }
        });
    }

    remove(store, keys) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };
            try {
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error) => {
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
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_FAILED)({ adapter: this, error }));
            }
        });
    }

    removeAll(store) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };
            try {
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = (error) => {
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
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    contains(store, key) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };
            try {
                let result;
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                tx.oncomplete = () => {
                    resolve(result);
                };
                tx.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };
                const objectStore = tx.objectStore(store);
                const request = objectStore.get(key);

                request.onsuccess = (e) => {
                    const object = e.target.result;
                    result = !!object;
                };
            } catch (error) {
                if (tx) {
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)({ adapter: this, error }));
            }
        });
    }

    count(store, options) {
        return new Promise((resolve, reject) => {
            const { onIDBGetRequest, query } = options || {};
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            try {
                let result;
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                tx.oncomplete = () => {
                    resolve(result);
                };
                tx.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.COUNT_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.COUNT_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = onIDBGetRequest ?
                    onIDBGetRequest(objectStore) :
                    objectStore.count(query);

                request.onsuccess = (e) => {
                    result = e.target.result;
                };
            } catch (error) {
                if (tx) {
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.COUNT_FAILED)({ adapter: this, error }));
            }
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve();
                return;
            }
            try {
                const db = this.db;
                IndexedDBAdapter.closeDB(db);
                this.db = null;
                resolve();
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.CLOSE_FAILED)({ adapter: this, error }));
            }
        });
    }

    async destroy() {
        await new Promise((resolve, reject) => {
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

    isOpen() {
        return !!this.db;
    }
}
