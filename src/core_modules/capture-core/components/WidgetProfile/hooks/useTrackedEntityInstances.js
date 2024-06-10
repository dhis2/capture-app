// @flow
import { useMemo, useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import type { Geometry } from '../DataEntry/helpers/types';

type InputAttribute = {
    attribute: string,
    code: string,
    created: string,
    displayName: string,
    lastUpdated: string,
    value: string,
    valueType: string,
};

export const useTrackedEntityInstances = (
    teiId: string,
    programId: string,
    storedAttributeValues: Array<{ [key: string]: string }>,
    storedGeometry: ?Geometry,
) => {
    const [trackedEntityInstanceAttributes, setTrackedEntityInstanceAttributes] = useState<Array<InputAttribute>>([]);
    const [geometry, setGeometry] = useState();

    const { error, loading, data } = useDataQuery(
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
                    id: ({ variables: { tetId } }) => tetId,
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
        if (data?.trackedEntityInstance?.attributes?.length > 0) {
            setTrackedEntityInstanceAttributes(
                data?.trackedEntityInstance?.attributes.map(({ attribute, value }) => ({
                    attribute,
                    value,
                })),
            );
        }
    }, [data?.trackedEntityInstance?.attributes]);

    useEffect(() => {
        if (data?.trackedEntityInstance?.geometry) {
            setGeometry(data?.trackedEntityInstance?.geometry);
        }
    }, [data?.trackedEntityInstance?.geometry]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setTrackedEntityInstanceAttributes(storedAttributeValues);
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
        trackedEntityTypeName: !tetLoading && tetData?.trackedEntityType?.displayName,
        trackedEntityTypeAccess: !tetLoading && tetData?.trackedEntityType?.access,
        geometry,
    };
};
