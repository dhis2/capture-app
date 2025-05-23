import { useEffect, useMemo, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import type { Geometry, InputAttribute } from './hooks.types';

type TrackedEntityInstance = {
    attributes?: Array<{ attribute: string; value: string }>;
    geometry?: Geometry;
    trackedEntityType?: string;
    [key: string]: any;
};

type TrackedEntityTypeData = {
    trackedEntityType?: {
        displayName?: string;
        access?: any;
    };
};

type QueryData = {
    trackedEntityInstance?: TrackedEntityInstance;
};

export const useTrackedEntityInstances = (
    teiId: string,
    programId: string,
    storedAttributeValues: Array<{ [key: string]: string }>,
    storedGeometry?: Geometry,
) => {
    const [trackedEntityInstanceAttributes, setTrackedEntityInstanceAttributes] = useState<Array<InputAttribute>>([]);
    const [geometry, setGeometry] = useState<Geometry | undefined>();

    const { error, loading, data } = useDataQuery<QueryData>(
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
        const attributes = data?.trackedEntityInstance?.attributes;
        if (attributes && attributes.length > 0) {
            setTrackedEntityInstanceAttributes(
                attributes.map(({ attribute, value }: { attribute: string; value: string }) => ({
                    attribute,
                    value,
                    code: '',
                    createdAt: '',
                    displayName: '',
                    lastUpdated: '',
                    valueType: '',
                })),
            );
        }
    }, [data?.trackedEntityInstance?.attributes]);

    useEffect(() => {
        if (data?.trackedEntityInstance?.geometry) {
            setGeometry(data?.trackedEntityInstance?.geometry as Geometry);
        }
    }, [data?.trackedEntityInstance?.geometry]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setTrackedEntityInstanceAttributes(storedAttributeValues as Array<InputAttribute>);
        }
    }, [storedAttributeValues]);

    useEffect(() => {
        if (data?.trackedEntityInstance?.trackedEntityType) {
            refetchTET({ variables: { tetId: data?.trackedEntityInstance?.trackedEntityType } });
        }
    }, [data?.trackedEntityInstance?.trackedEntityType, refetchTET]);

    useEffect(() => {
        if (storedGeometry !== undefined) {
            setGeometry(storedGeometry);
        }
    }, [storedGeometry]);


    return { error,
        loading,
        trackedEntity: !loading && data?.trackedEntityInstance,
        trackedEntityInstanceAttributes: !loading && trackedEntityInstanceAttributes,
        trackedEntityTypeName: tetLoading ? undefined : (tetData?.trackedEntityType as any)?.displayName,
        trackedEntityTypeAccess: !tetLoading && (tetData?.trackedEntityType as any)?.access,
        geometry,
    };
};
