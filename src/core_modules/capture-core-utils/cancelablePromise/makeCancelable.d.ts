export type CancelablePromise<T> = {
    promise: Promise<T>;
    cancel: () => void;
};

export declare const makeCancelable: (promise: Promise<any>) => CancelablePromise<any>;
