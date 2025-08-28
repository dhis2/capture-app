export function createWebWorker(worker: string): Worker {
    const code = worker.toString();
    const blob = new Blob([`(${code})()`]);
    return new Worker(URL.createObjectURL(blob));
}

export const WebWorker = createWebWorker;
