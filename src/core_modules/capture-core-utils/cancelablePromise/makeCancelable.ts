export type CancelablePromise<T> = {
    promise: Promise<T>;
    cancel: () => void;
};

export const makeCancelable = <T>(promise: Promise<T>): CancelablePromise<T> => {
    let hasCanceled = false;

    const wrappedPromise: Promise<T> = new Promise((resolve, reject) => {
        promise.then(
            val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
            error => (hasCanceled ? reject({ isCanceled: true }) : reject(error)),
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => {
            hasCanceled = true;
        },
    };
};
