// @flow
import { useMemo, useState } from 'react';
import { userStores } from '../../storageControllers/stores';
import {
    getCachedSingleResourceFromKeyAsync,
} from './helpers/singleResourceFromKeyGetter';


export const useProgramFromIndexedDB = (programId: string) => {
    const [cachedProgram, setCachedProgram] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useMemo(() => {
        getCachedSingleResourceFromKeyAsync(userStores.PROGRAMS, programId)
            .then((singleProgram) => {
                setCachedProgram(singleProgram);
                setLoading(false);
            })
            .catch((e) => {
                setError(e);
                setLoading(false);
            });
    }, [programId]);

    return {
        loading,
        error,
        program: cachedProgram,
    };
};
