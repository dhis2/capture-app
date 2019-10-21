/* eslint-disable complexity */

export default () => {
    let db;
    self.addEventListener('message', (event) => { // eslint-disable-line no-restricted-globals
        if (!event) {
            postMessage({ success: false });
        }

        const { type } = event.data;

        switch (type) {
        case 'init': {
            const { name, version } = event.data;
            const request = indexedDB.open(name, version);
            request.onsuccess = (e) => {
                db = e.target.result;
                postMessage({ type, success: true });
            };

            request.onerror = (error) => {
                postMessage({ type, error });
            };
            break;
        }
        case 'getCategoryOptionsInBatches': {
            let tx;
            let catchError;
            const abortTx = (error) => {
                catchError = error;
                tx.abort();
            };

            const { batchSize, workerOptions } = event.data;

            try {
                const records = [];
                tx = db.transaction('categoryOptions', 'readonly');
                const objectStore = tx.objectStore('categoryOptions');
                getAllInBatches(objectStore, { batchSize, ...workerOptions }, records);

                tx.oncomplete = () => {
                    postMessage({ records, success: true });
                };

                tx.onerror = (error) => {
                    postMessage({ error });
                };

                tx.onabort = () => {
                    postMessage({ aborted: true, error: catchError });                    
                };
            } catch (error) {
                if (tx) {
                    abortTx(error);
                }
                postMessage({ error });
            }
            break;
        }
        default:
            postMessage({ success: false });
            break;
        }

        function getAllInBatches(objectStore, options, records) {
            const { batchSize, categoryOptionIds, organisationUnitId } = options;

            const executeRequest = keyRange =>
                new Promise((resolve) => {
                    const request = objectStore.getAll(keyRange, batchSize);

                    request.onsuccess = (e) => {
                        const values = request.result;
                        const count = values ? values.length : 0;
                        let lastId;
                        if (count > 0) {
                            values.forEach((value) => {
                                processGetAllItem(value, { categoryOptionIds, organisationUnitId }, records);
                            });
                            lastId = values[count - 1].id;
                        }
                        resolve({ count, lastId });
                    };
                });

            const requestBatchesRecursively = (keyRange) => {
                executeRequest(keyRange)
                    .then(({count, lastId}) => {
                        if (count >= batchSize) {
                            keyRange = IDBKeyRange.lowerBound(lastId, true);
                            requestBatchesRecursively(keyRange);
                        }
                    });
            };
            requestBatchesRecursively();
        }

        function processGetAllItem(dbValue, options, records) {
            if (predicate(dbValue, options)) {
                const value = project(dbValue);
                records.push(value);
            }
        }

        function predicate(categoryOption, options) {
            const { organisationUnitId, categoryOptionIds } = options;
            const isOptionForCategory = categoryOptionIds[categoryOption.id];
            if (!isOptionForCategory) {
                return false;
            }

            const orgUnits = categoryOption.organisationUnits;
            if (!orgUnits) {
                return true;
            }
            return !!orgUnits[organisationUnitId];
        };

        function project(categoryOption) {
            return {
                label: categoryOption.displayName,
                value: categoryOption.id,
            };
        }
    });
};
