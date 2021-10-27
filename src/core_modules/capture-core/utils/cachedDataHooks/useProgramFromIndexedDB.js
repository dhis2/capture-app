// @flow
import { useMemo, useRef, useState } from 'react';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../storageControllers/stores';


export const useProgramFromIndexedDB = (programId: string) => {
    const [cachedProgram, setCachedProgram] = useState();
    const [loading, setLoading] = useState(true);
    const error = useRef();

    useMemo(() => {
        getCachedSingleResourceFromKeyAsync(userStores.PROGRAMS, programId)
            .then((singleProgram) => {
                setCachedProgram(singleProgram);
                setLoading(false);
            })
            .catch((e) => {
                error.current = e;
            });
    }, [programId]);

    return {
        loading,
        error: error.current,
        program: cachedProgram,
    };
};
