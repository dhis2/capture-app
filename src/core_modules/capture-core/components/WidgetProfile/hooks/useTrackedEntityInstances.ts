import { useEffect, useMemo, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import type { Geometry } from '../DataEntry/helpers/types';

type InputAttribute = {
    attribute: string;
    code?: string;
    created?: string;
    displayName?: string;
    lastUpdated?: string;
    value: string;
    valueType?: string;
};

type TrackedEntityInstance = {
    attributes?: Array<{ attribute: string; value: string }>;
    geometry?: Geometry;
    trackedEntityType?: string;
    [key: string]: any;
};

type TrackedEntityType = {
    displayName?: string;
    access?: any;
    [key: string]: any;
};

type QueryData = {
    trackedEntityInstance?: TrackedEntityInstance;
    trackedEntityType?: TrackedEntityType;
};

type TrackedEntityInstanceReturnType = {
    error?: any;
    loading: boolean;
    trackedEntity?: TrackedEntityInstance;
    trackedEntityInstanceAttributes?: InputAttribute[];
    trackedEntityTypeName?: string;
    trackedEntityTypeAccess?: any;
    geometry?: Geometry;
};

export const useTrackedEntityInstances = (
    teiId: string,
    programId: string,
    storedAttributeValues: Array<{ [key: string]: string }>,
    storedGeometry?: Geometry,
): TrackedEntityInstanceReturnType => {
    const [trackedEntityInstanceAttributes, setTrackedEntityInstanceAttributes] = useState<InputAttribute[]>([]);
    const [geometry, setGeometry] = useState<Geometry | undefined>();

    const { error, loading, data } = useDataQuery<{ trackedEntityInstance: TrackedEntityInstance }>(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'tracker/trackedEntities',
                    id: teiId,
                    params: {
                        program: programId,
                    },
                },
            }),
            [teiId, programId],
        ),
    );

    const { loading: tetLoading, data: tetData, refetch: refetchTET } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityType: {
                    resource: 'trackedEntityTypes',
                    id: ({ variables }: any) => variables.tetId,
                    params: {
                        fields: 'displayName,access',
                    },
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        const teiAttributes = data?.trackedEntityInstance?.attributes;
        if (teiAttributes && teiAttributes.length > 0) {
            setTrackedEntityInstanceAttributes(
                teiAttributes.map(({ attribute, value }) => ({
                    attribute,
                    value,
                })),
            );
        }
    }, [data?.trackedEntityInstance?.attributes]);

    useEffect(() => {
        const teiGeometry = data?.trackedEntityInstance?.geometry;
        if (teiGeometry) {
            setGeometry(teiGeometry);
        }
    }, [data?.trackedEntityInstance?.geometry]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setTrackedEntityInstanceAttributes(storedAttributeValues as InputAttribute[]);
        }
    }, [storedAttributeValues]);

    useEffect(() => {
        const teiType = data?.trackedEntityInstance?.trackedEntityType;
        if (teiType) {
            refetchTET({ variables: { tetId: teiType } });
        }
    }, [data?.trackedEntityInstance?.trackedEntityType, refetchTET]);

    useEffect(() => {
        if (storedGeometry !== undefined) {
            setGeometry(storedGeometry);
        }
    }, [storedGeometry]);

    return {
        error,
        loading,
        trackedEntity: !loading ? data?.trackedEntityInstance : undefined,
        trackedEntityInstanceAttributes: !loading ? trackedEntityInstanceAttributes : undefined,
        trackedEntityTypeName: tetLoading ? undefined : (tetData?.trackedEntityType as TrackedEntityType)?.displayName,
        trackedEntityTypeAccess: !tetLoading ? (tetData?.trackedEntityType as TrackedEntityType)?.access : undefined,
        geometry,
    };
};
