// @flow
import { useCallback, useEffect, useRef, useState } from 'react';
import { containsKeyInStorageAsync } from '../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../storageControllers/stores';

type Props = {|
    programId?: string,
    orgUnitId?: string,
|}

const IdTypes = Object.freeze({
    PROGRAM: 'programId',
});

export const useValidatedIDsFromCache = ({ programId, orgUnitId }: Props) => {
    const [valid, setValid] = useState();
    const [loading, setLoading] = useState(true);
    const error = useRef();

    const getPromises = useCallback(() => {
        const promises = [];
        const keys = [];
        if (programId) {
            keys.push({ id: programId, type: IdTypes.PROGRAM });
            promises.push(containsKeyInStorageAsync(userStores.PROGRAMS, programId));
        }
        if (orgUnitId) {
            promises.push(containsKeyInStorageAsync(userStores.ORGANISATION_UNITS_BY_PROGRAM, orgUnitId));
        }

        Promise.all(promises)
            .then((adapterResponses) => {
                // $FlowFixMe - Missing declaration for U
                const isValidObjects = keys.map(({ id, type }, index) => ({
                    id,
                    valid: adapterResponses[index],
                    type,
                }));
                setValid(isValidObjects);
                setLoading(false);
            })
            .catch((e) => {
                error.current = e;
                setLoading(false);
            });
    }, [programId, orgUnitId]);

    useEffect(() => {
        setLoading(true);
        getPromises();
    }, [programId, orgUnitId, getPromises]);

    return {
        valid,
        loading,
        error: error.current,
    };
};
