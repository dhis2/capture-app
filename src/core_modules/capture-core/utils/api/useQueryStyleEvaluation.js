// @flow
import { useState, useEffect } from 'react';

// Caches result from previous evaluation
// Does not evaluate falsy input values - returns previously cached value instead
export const useQueryStyleEvaluation = (asyncFn: (input: any) => Promise<any>, input: any) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [previousInput, setPreviousInput] = useState();

    useEffect(() => {
        if (input && input !== previousInput && !loading) {
            setLoading(true);
            setData(undefined);
            setError(undefined);
            setPreviousInput(input);
            asyncFn(input).then((result) => {
                setLoading(false);
                setData(result);
            }).catch((e) => {
                setLoading(false);
                setError(e);
            });
        }
    }, [loading, asyncFn, input, previousInput, setLoading, setData, setError, setPreviousInput]);

    return {
        loading: loading || (!!input && input !== previousInput),
        data,
        error,
    };
};
