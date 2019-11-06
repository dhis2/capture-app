// @flow
import { WebWorker } from 'capture-core-utils';
import indexedDBWorker from './indexedDBWorker';

export default function initIndexedDBWorkerAsync(name: string, version: string): Promise<Worker> {
    return new Promise((resolve) => {
        const worker = new WebWorker(indexedDBWorker);
        worker.postMessage({ type: 'init', name, version });
        worker.addEventListener('message', () => {
            resolve(worker);
        });
    });
}
