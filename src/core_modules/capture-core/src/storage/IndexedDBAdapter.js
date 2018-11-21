/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import isDefined from 'd2-utilizr/lib/isDefined';
import isArray from 'd2-utilizr/lib/isArray';
import errorCreator from '../utils/errorCreator';

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

    static getAbortTransaction(tx, onAborted) {
        let abortMessage;
        let aborted = false;
        tx.onabort = () => {
            onAborted(abortMessage);
        };
        return (error) => {
            if (!abortMessage) {
                abortMessage = error;
            }

            if (!aborted) {
                aborted = true;
                tx.abort();
            }
        };
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

    open(onBeforeUpgrade, onAfterUpgrade) {
        const request = IndexedDBAdapter.indexedDB.open(this.name, this.version);

        let successEventExecuted = false;
        let upgradeIsExecuting = false;
        return new Promise((resolve, reject) => {
            request.onsuccess = (e) => {
                this.db = e.target.result;
                successEventExecuted = true;
                if (!upgradeIsExecuting) {
                    resolve();
                }
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
                upgradeIsExecuting = true;
                const onBeforeUpgradePromise = onBeforeUpgrade ? onBeforeUpgrade({ get: (store, key) => this._get(store, key, tx) }) : Promise.resolve();
                onBeforeUpgradePromise
                    .then(() => {
                        this._upgrade();
                    })
                    .then(() => {
                        return onAfterUpgrade && onAfterUpgrade({ set: (store, data) => this.set_(store, data, tx) });
                    })
                    .then(() => {
                        if (successEventExecuted) {
                            resolve();
                        }
                    });
            };
        });
    }

    _set(store, dataObject, tx) {
        
    }

    set(store, dataObject) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            if (!isDefined(dataObject) || !isDefined(dataObject[this.keyPath])) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.INVALID_STORAGE_OBJECT)({ adapter: this }));
                return;
            }

            const storeObject = JSON.parse(JSON.stringify(dataObject));
            const key = storeObject[this.keyPath];
            delete storeObject[this.keyPath];

            let tx;
            let abortTransaction;
            try {
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                abortTransaction = IndexedDBAdapter.getAbortTransaction(tx, reject);
                const objectStore = tx.objectStore(store);
                const request = objectStore.put(storeObject, key);

                request.onsuccess = () => {
                    resolve(storeObject);
                };

                request.onerror = (error) => {
                    if (tx) {
                        abortTransaction(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                    }
                    reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                };
            } catch (error) {
                if (tx) {
                    abortTransaction(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    setAll(store, dataArray) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            if (!dataArray || !isArray(dataArray)) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.STORAGE_ARRAY_NOT_PROVIDED)({ adapter: this }));
                return;
            }

            let tx;
            let abortTransaction;
            try {
                tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                abortTransaction = IndexedDBAdapter.getAbortTransaction(tx, reject);

                const objectStore = tx.objectStore(store);
                let storedCount = 0;
                const insertItem = () => {
                    if (storedCount < dataArray.length) {
                        const dataObject = dataArray[storedCount];
                        const storeObject = JSON.parse(JSON.stringify(dataObject));

                        if (!isDefined(storeObject) || !isDefined(storeObject[this.keyPath])) {
                            abortTransaction(errorCreator(IndexedDBAdapter.errorMessages.INVALID_STORAGE_OBJECT)({ adapter: this }));
                        }

                        const key = storeObject[this.keyPath];
                        delete storeObject[this.keyPath];

                        const request = objectStore.put(storeObject, key);

                        request.onsuccess = () => {
                            storedCount += 1;
                            insertItem();
                        };

                        request.onerror = (error) => {
                            if (tx) {
                                abortTransaction(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                            }
                            reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                        };
                    } else {
                        resolve();
                    }
                };
                insertItem();
            } catch (error) {
                if (tx) {
                    abortTransaction(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
                }
                reject(errorCreator(IndexedDBAdapter.errorMessages.SET_FAILED)({ adapter: this, error }));
            }
        });
    }

    _get(store, key, tx) {
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
            if (!this.verifyDbSet(reject)) {
                return;
            }

            if (!key) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
                return;
            }

            try {
                const tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                this._get(store, key, tx)
                    .then((object) => {
                        resolve(object);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_FAILED)({ adapter: this, error }));
            }
        });
    }

    getAll(store, predicate) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            const records = [];
            const filtered = typeof predicate === 'function';

            try {
                const tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
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
                    } else {
                        resolve(records);
                    }
                };

                request.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
                };
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    getKeys(store) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            const keys = [];

            try {
                const tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                const objectStore = tx.objectStore(store);
                const request = objectStore.openCursor();

                request.onsuccess = (e) => {
                    const cursor = e.target.result;

                    if (cursor) {
                        keys.push(cursor.key);
                        cursor.continue();
                    } else {
                        resolve(keys);
                    }
                };

                request.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)({ adapter: this, error }));
                };
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.GET_KEYS_FAILED)({ adapter: this, error }));
            }
        });
    }

    remove(store, key) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            if (!key) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
                return;
            }

            try {
                const tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                const objectStore = tx.objectStore(store);
                const request = objectStore.delete(key);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_FAILED)({ adapter: this, error }));
                };
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_FAILED)({ adapter: this, error }));
            }
        });
    }

    removeAll(store) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            try {
                const tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_WRITE);
                const objectStore = tx.objectStore(store);
                const request = objectStore.clear();

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_ALL_FAILED)({ adapter: this, error }));
                };
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.REMOVE_ALL_FAILED)({ adapter: this, error }));
            }
        });
    }

    contains(store, key) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            if (!key) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.INVALID_KEY)({ adapter: this }));
                return;
            }

            try {
                const tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                const objectStore = tx.objectStore(store);
                const request = objectStore.get(key);

                request.onsuccess = (e) => {
                    const object = e.target.result;
                    resolve(!!object);
                };

                request.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)({ adapter: this, error }));
                };
            } catch (error) {
                reject(errorCreator(IndexedDBAdapter.errorMessages.CONTAINS_FAILED)({ adapter: this, error }));
            }
        });
    }

    count(store, key) {
        return new Promise((resolve, reject) => {
            if (!this.verifyDbSet(reject)) {
                return;
            }

            if (!key) {
                key = null;
            }

            try {
                const tx = this.db.transaction([store], IndexedDBAdapter.transactionMode.READ_ONLY);
                const objectStore = tx.objectStore(store);
                const request = objectStore.count(key);

                request.onsuccess = (e) => {
                    const result = e.target.result;
                    resolve(result);
                };

                request.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.COUNT_FAILED)({ adapter: this, error }));
                };
            } catch (error) {
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
                this.db.close();

                this.db.onerror = (error) => {
                    reject(errorCreator(IndexedDBAdapter.errorMessages.CLOSE_FAILED)({ adapter: this, error }));
                };

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

    verifyDbSet(onNotFulfilled) {
        if (!this.db) {
            onNotFulfilled(errorCreator(IndexedDBAdapter.errorMessages.OPEN_DATABASE_FIRST)({ adapter: this }));
            return false;
        }
        return true;
    }
}

export default IndexedDBAdapter;
