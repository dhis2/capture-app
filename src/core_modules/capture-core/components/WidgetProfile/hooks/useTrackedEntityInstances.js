// @flow
import { useMemo, useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type InputAttribute = {
    attribute: string,
    code: string,
    created: string,
    displayName: string,
    lastUpdated: string,
    value: string,
    valueType: string,
};

export const useTrackedEntityInstances = (teiId: string, programId: string, storedAttributeValues: Array<{ [key: string]: string }>) => {
    const [trackedEntityInstanceAttributes, setTrackedEntityInstanceAttributes] = useState<Array<InputAttribute>>([]);

    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'trackedEntityInstances',
                    id: teiId,
                    params: {
                        program: programId,
                    },
                },
            }),
            [teiId, programId],
        ),
    );

    useEffect(() => {
        if (data?.trackedEntityInstance?.attributes?.length > 0) {
            setTrackedEntityInstanceAttributes(data?.trackedEntityInstance?.attributes);
        }
    }, [data?.trackedEntityInstance?.attributes]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setTrackedEntityInstanceAttributes(teiAttributes =>
                teiAttributes.map(teiAttribute => ({
                    ...teiAttribute,
                    value: storedAttributeValues.find(stored => stored.attribute === teiAttribute.attribute)?.value || teiAttribute.value,
                })),
            );
        }
    }, [storedAttributeValues]);

    return { error, loading, trackedEntityInstanceAttributes: !loading && trackedEntityInstanceAttributes };
};
