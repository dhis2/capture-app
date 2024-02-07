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

type ReturnTypes = {|
    valid: {
        [key: string]: ?{
            id: string,
            valid: boolean,
            type: $Values<typeof IdTypes>,
        },
    },
    loading: boolean,
    error?: Error,
|}

export const useValidatedIDsFromCache = ({ programId, orgUnitId }: Props): ReturnTypes => {
    const [valid, setValid] = useState({
        [IdTypes.PROGRAM_ID]: undefined,
        [IdTypes.ORG_UNIT_ID]: undefined,
    });
    const [error, setError] = useState();

    const getPromises = useCallback(() => {
        const promises = [];
        if (programId) {
            promises.push(containsKeyInStorageAsync(userStores.PROGRAMS, programId, { id: programId, type: IdTypes.PROGRAM_ID, convert: value => value }));
        }

        if (orgUnitId) {
            promises.push(getCachedSingleResourceFromKeyAsync(userStores.ORGANISATION_UNITS_BY_PROGRAM, programId, { id: orgUnitId, type: IdTypes.ORG_UNIT_ID, convert: value => !!value?.organisationUnits[orgUnitId] }));
        }

        Promise.all(promises)
            .then((adapterResponses) => {
                const adapterResponseObjects = adapterResponses.reduce((acc, { id, type, convert, response }) => {
                    acc = { ...acc,
                        [type]: {
                            id,
                            valid: convert && convert(response),
                            type,
                        } };
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
        loading: false,
        error,
    } : {
        valid: {
            [IdTypes.PROGRAM_ID]: undefined,
            [IdTypes.ORG_UNIT_ID]: undefined,
        },
        loading: true,
        error: undefined,
    };

    return { ...inEffectData };
};
