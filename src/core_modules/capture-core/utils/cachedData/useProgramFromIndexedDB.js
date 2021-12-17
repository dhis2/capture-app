// @flow
import { useMemo, useState } from 'react';
import {
    getCachedSingleResourceFromKeyAsync,
} from './helpers/singleResourceFromKeyGetter';
import { userStores } from '../../storageControllers/stores';


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
