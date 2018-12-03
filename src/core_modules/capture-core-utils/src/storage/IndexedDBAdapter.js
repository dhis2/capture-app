/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import isDefined from 'd2-utilizr/lib/isDefined';
import errorCreator from '../errorCreator';

class IndexedDBAdapter {
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

    constructor(options) {
        this.name = options.name;
        this.version = options.version;
        this.objectStoreNames = options.objectStores;
        this.keyPath = options.keyPath;
    }

    _upgrade() {
        this.objectStoreNames.forEach((name) => {
            if (this.db.objectStoreNames.contains(name)) {
                this.db.deleteObjectStore(name);
            }
        });

        this.objectStoreNames.forEach((name) => {
            this.db.createObjectStore(name);
        });
    }

    /*
        onBeforeUpgrade: a callback method, getting an object with a "get" property as argument. The "get" property can be used to retrieve something from IndexedDB
        onAfterUpgrade: a callback method, getting an ojbect with a "set" property as argument. The "set" property can be used to set something in IndexedDB
    */
    open(onBeforeUpgrade, onAfterUpgrade) {
        const request = IndexedDBAdapter.indexedDB.open(this.name, this.version);
        return new Promise((resolve, reject) => {
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };

            request.onerror = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.OPEN_FAILED)({ adapter: this, error }));
            };

            request.onblocked = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.OPEN_BLOCKED)({ adapter: this, error }));
            };

            request.onupgradeneeded = (e) => {
                this.db = e.target.result;
                const tx = e.target.transaction;

                return Promise.resolve()
                    .then(() => onBeforeUpgrade
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
                        this._upgrade();
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
            delete storeObject[this.keyPath];
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
                delete storeObject[this.keyPath];

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
                        delete storeObject[this.keyPath];
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

    get(store, key) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            try {
                let resultObject;
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                tx.oncomplete = () => {
                    resolve(resultObject);
                };
                tx.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
                };
                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = objectStore.get(key);
                request.onsuccess = (e) => {
                    const object = e.target.result;

                    if (isDefined(object)) {
                        object[this.keyPath] = key;
                    }
                    resultObject = object;
                };
            } catch (error) {
                if (tx) {
                    abortTx(error);
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
            }
        });
    }

    getAll(store, predicate) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            try {
                const records = [];
                const filtered = typeof predicate === 'function';

                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                tx.oncomplete = () => {
                    resolve(records);
                };

                tx.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
                };

                tx.onabort = () => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)(
                        { adapter: this, aborted: true, error: catchError }));
                };

                const objectStore = tx.objectStore(store);
                const request = objectStore.openCursor();
                request.onsuccess = (e) => {
                    const cursor = e.target.result;

                    if (cursor) {
                        cursor.value[this.keyPath] = cursor.key;

                        if (filtered) {
                            if (predicate(cursor.value)) {
                                records.push(cursor.value);
                            }
                        } else {
                            records.push(cursor.value);
                        }

                        cursor.continue();
                    }
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

    remove(store, key) {
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
                objectStore.delete(key);
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

    count(store, key) {
        return new Promise((resolve, reject) => {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            if (!key) {
                key = null;
            }

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
                const request = objectStore.count(key);

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
                db.close();
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

        await new Promise((resolve, reject) => {
            const request = IndexedDBAdapter.indexedDB.deleteDatabase(this.name);

            request.onsuccess = (e) => {
                resolve(e);
            };

            request.onerror = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.DESTROY_FAILED)({ adapter: this, error }));
            };

            request.onblocked = (error) => {
                reject(errorCreator(IndexedDBAdapter.errorMessages.DESTROY_BLOCKED)({ adapter: this, error }));
            };
        });
    }

    isOpen() {
        return !!this.db;
    }
}

export default IndexedDBAdapter;
