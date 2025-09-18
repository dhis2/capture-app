import { useCallback, useEffect, useState } from 'react';
import {
    containsKeyInStorageAsync,
    getCachedSingleResourceFromKeyAsync,
} from '../../MetaDataStoreUtils/MetaDataStoreUtils';
import { USER_METADATA_STORES } from '../../storageControllers';

type Props = {
    programId: string;
    orgUnitId?: string;
};

export const IdTypes = Object.freeze({
    PROGRAM_ID: 'programId',
    ORG_UNIT_ID: 'orgUnitId',
});

type ValidatedId = {
    id: string;
    valid: boolean;
    type: keyof typeof IdTypes;
};

type ReturnTypes = {
    valid: {
        [key: string]: ValidatedId | undefined;
    };
    loading: boolean;
    error?: Error;
};

export const useValidatedIDsFromCache = ({ programId, orgUnitId }: Props): ReturnTypes => {
    const [valid, setValid] = useState<{ [key: string]: ValidatedId | undefined }>({
        [IdTypes.PROGRAM_ID]: undefined,
        [IdTypes.ORG_UNIT_ID]: undefined,
    });
    const [error, setError] = useState<Error | undefined>();

    const getPromises = useCallback(() => {
        const promises: any[] = [];
        if (programId) {
            promises.push(containsKeyInStorageAsync(
                USER_METADATA_STORES.PROGRAMS, 
                programId, 
                { id: programId, type: IdTypes.PROGRAM_ID, convert: (value: any) => value }
            ));
        }

        if (orgUnitId) {
            promises.push(getCachedSingleResourceFromKeyAsync(
                USER_METADATA_STORES.ORGANISATION_UNITS_BY_PROGRAM, 
                programId, 
                { id: orgUnitId, type: IdTypes.ORG_UNIT_ID, convert: (value: any) => !!value?.organisationUnits[orgUnitId] }
            ));
        }

        Promise.all(promises)
            .then((adapterResponses: any[]) => {
                const adapterResponseObjects = adapterResponses.reduce((acc: any, { id, type, convert, response }: any) => {
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
            .catch((e: Error) => {
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
