// @flow

export type CancelablePromise<T> = {
  promise: Promise<T>,
  cancel: () => void,
};

const makeCancelable = (promise: Promise<any>) => {
  let hasCanceled = false;

  const wrappedPromise: Promise<any> = new Promise((resolve, reject) => {
    promise.then(
      // eslint-disable-next-line prefer-promise-reject-errors
      (val) => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      // eslint-disable-next-line prefer-promise-reject-errors
      (error) => (hasCanceled ? reject({ isCanceled: true }) : reject(error)),
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
