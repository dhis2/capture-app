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

export const IdTypes = Object.freeze({
    PROGRAM_ID: 'programId',
    ORG_UNIT_ID: 'orgUnitId',
});

export const useValidatedIDsFromCache = ({ programId, orgUnitId }: Props) => {
    const [valid, setValid] = useState({
        [IdTypes.PROGRAM_ID]: undefined,
        [IdTypes.ORG_UNIT_ID]: undefined,
    });
    const [error, setError] = useState();

    const getPromises = useCallback(() => {
        const promises = [];
        const keys = [];
        if (programId) {
            keys.push({ id: programId, type: IdTypes.PROGRAM_ID, convert: value => value });
            promises.push(containsKeyInStorageAsync(userStores.PROGRAMS, programId));
        }

        if (orgUnitId) {
            keys.push({ id: orgUnitId, type: IdTypes.ORG_UNIT_ID, convert: value => !!value?.organisationUnits[orgUnitId] });
            promises.push(getCachedSingleResourceFromKeyAsync(userStores.ORGANISATION_UNITS_BY_PROGRAM, programId));
        }

        Promise.all(promises)
            .then((adapterResponses) => {
                // $FlowFixMe - Missing declaration for U
                const adapterResponseObjects = keys.reduce((acc, { id, type, convert }, index) => {
                    acc[type] = {
                        id,
                        valid: convert(adapterResponses[index]),
                        type,
                    };
                    return acc;
                }, {});
                setValid(adapterResponseObjects);
            })
            .catch((e) => {
                setError(e);
            });
    }, [programId, orgUnitId]);

    useEffect(() => {
        getPromises();
    }, [programId, orgUnitId, getPromises]);

    const inEffectData = (programId === valid[IdTypes.PROGRAM_ID]?.id) && (orgUnitId === valid[IdTypes.ORG_UNIT_ID]?.id) ? {
        valid,
        error,
    } : {
        valid: {
            [IdTypes.PROGRAM_ID]: undefined,
            [IdTypes.ORG_UNIT_ID]: undefined,
        },
        error: undefined,
    };

    return { ...inEffectData };
};
