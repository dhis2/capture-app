// @flow
import { useCallback, useEffect, useState } from 'react';
import {
    containsKeyInStorageAsync,
    getCachedSingleResourceFromKeyAsync,
} from '../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../storageControllers/stores';

type Props = {|
    programId: string,
    orgUnitId?: string,
|}

const IdTypes = Object.freeze({
    PROGRAM: 'programId',
    ORG_UNIT: 'orgUnitId',
});

export const useValidatedIDsFromCache = ({ programId, orgUnitId }: Props) => {
    const [valid, setValid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const getPromises = useCallback(() => {
        const promises = [];
        const keys = [];
        if (programId) {
            keys.push({ id: programId, type: IdTypes.PROGRAM });
            promises.push(containsKeyInStorageAsync(userStores.PROGRAMS, programId));
        }
        if (orgUnitId) {
            keys.push({ id: orgUnitId, type: IdTypes.ORG_UNIT });
            promises.push(getCachedSingleResourceFromKeyAsync(userStores.ORGANISATION_UNITS_BY_PROGRAM, programId));
        }

        Promise.all(promises)
            .then((adapterResponses) => {
                if (orgUnitId) {
                    adapterResponses[1] = adapterResponses[1]?.organisationUnits[orgUnitId];
                }
                // $FlowFixMe - Missing declaration for U
                const adapterResponseObjects = keys.map(({ id, type }, index) => ({
                    id,
                    valid: adapterResponses[index],
                    type,
                }));
                setValid(adapterResponseObjects);
                setLoading(false);
            })
            .catch((e) => {
                setError(e);
                setLoading(false);
            });
    }, [programId, orgUnitId]);

    useEffect(() => {
        getPromises();
    }, [programId, orgUnitId, getPromises]);

    const inEffectData = !loading && (programId === valid[0]?.id) && (orgUnitId === valid[1]?.id) ? {
        valid,
        error,
    } : {
        valid: [],
        error: undefined,
    };

    return { ...inEffectData, loading };
};
