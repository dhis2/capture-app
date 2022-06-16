// @flow
import { useState, useCallback, useLayoutEffect, useRef } from 'react';
import { makeCancelablePromise } from 'capture-core-utils';

type AsyncFn = (args: Array<any>) => any;
type Args = Array<any>;

export const useCancelableAsyncFn = (asyncFn: AsyncFn, hardLoadMode: boolean, ...args: Args) => {
    const [result, setResult] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const hardLoadModeStaticRef = useRef(hardLoadMode);

    const prevArgsRef = useRef();
    const currentTransactionIdRef = useRef(0);


    if (hardLoadModeStaticRef.current) {
        const prevArgs = prevArgsRef.current;
        if (args.some((arg, index) => arg !== (prevArgs && prevArgs[index]))) {
            prevArgsRef.current = args;
            currentTransactionIdRef.current += 1;
        }
    }

    let cancel;
    const execute = useCallback(async () => {
        const promise = asyncFn(...args);
        if (!(promise instanceof Promise)) {
            setResult({ data: promise, transactionId: currentTransactionIdRef.current });
            setLoading(false);
        } else {
            let cancelablePromise;
            ({ promise: cancelablePromise, cancel } = makeCancelablePromise(promise)); // eslint-disable-line
            try {
                const data = await cancelablePromise;
                setResult({ data, transactionId: currentTransactionIdRef.current });
                setLoading(false);
            } catch (errorArg) {
                if (!errorArg || !errorArg.isCanceled) {
                    setError('An error occured. Please try again later');
                    setLoading(false);
                }
            }
        }
    }, [...args]);

    useLayoutEffect(() => {
        if (!hardLoadModeStaticRef.current) {
            setLoading(true);
        }

        if (asyncFn) {
            execute();
        } else if (hardLoadModeStaticRef.current) {
            setResult({ transactionId: currentTransactionIdRef.current, data: undefined });
        } else {
            setLoading(false);
        }
        return () => cancel && cancel();
    }, [asyncFn, execute, cancel]);

    return {
        data: result.data,
        error,
        loading: hardLoadMode ? currentTransactionIdRef.current !== result.transactionId : loading,
    };
};
