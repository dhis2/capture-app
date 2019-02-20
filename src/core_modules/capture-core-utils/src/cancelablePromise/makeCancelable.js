// @flow

export type CancelablePromise<T> = {
    promise: Promise<T>,
    cancel: () => void,
};

const makeCancelable = (promise: Promise<any>) => {
    let hasCanceled = false;

    const wrappedPromise: Promise<any> = new Promise((resolve, reject) => {
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

export default makeCancelable;
