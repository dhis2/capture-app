import { useMemo, useEffect } from 'react';
import log from 'loglevel';
import { FEATURES, featureAvailable, errorCreator } from 'capture-core-utils';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';

export const useTrackedEntityAttributes = (teiId?: string, programId?: string) => {
    const {
        data: programAttributes,
        error: programAttributesError,
        isError: programAttributesIsError,
        isLoading: programAttributesIsLoading,
    } = useApiDataQuery(
        ['trackedEntities', 'attributes', teiId, programId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                program: programId,
                fields: ['attributes'],
            },
        },
        {
            enabled: !!teiId && !!programId,
        },
    );

    const {
        data: tetAttributes,
        error: tetAttributesError,
        isError: tetAttributesIsError,
        isLoading: tetAttributesIsLoading,
    } = useApiDataQuery(
        ['trackedEntities', 'attributes', teiId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                fields: ['attributes'],
            },
        },
        {
            enabled: programAttributesIsError && !!teiId,
        },
    );

    useEffect(() => {
        if (programAttributesIsError) {
            if (featureAvailable(FEATURES.moreGenericErrorMessages)) {
                const { httpStatusCode } = (programAttributesError as any)?.details || {};
                if (httpStatusCode === 404) {
                    return;
                }
            }
            log.error(errorCreator('Could not retrieve program attributes')({ programAttributesError }));
        }
    }, [programAttributesIsError, programAttributesError]);

    useEffect(() => {
        if (tetAttributesIsError) {
            log.error(errorCreator('Could not retrieve tracked entity type attributes')({ tetAttributesError }));
        }
    }, [tetAttributesIsError, tetAttributesError]);

    const trackedEntityAttributes = useMemo(() => {
        if (!teiId) {
            return undefined;
        }

        return (programAttributesIsError && tetAttributesIsError) ? [] :
            ((programAttributes as any)?.attributes || (tetAttributes as any)?.attributes || undefined);
    }, [teiId, programAttributesIsError, tetAttributesIsError, programAttributes, tetAttributes]);

    return {
        trackedEntityAttributes,
        loading: programAttributesIsLoading || tetAttributesIsLoading,
    };
};
