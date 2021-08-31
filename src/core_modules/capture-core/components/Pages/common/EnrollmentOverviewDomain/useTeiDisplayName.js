// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { getAttributesFromScopeId } from '../../../../metaData/helpers';

export const deriveTeiName = (attributes: Array<any>, trackedEntityType: string) => {
    const tetAttributes = getAttributesFromScopeId(trackedEntityType);
    const [firstId, secondId] = tetAttributes.filter(({ displayInReports }) => displayInReports).map(({ id }) => id);

    const firstValue = attributes.find(({ attribute }) => attribute === firstId)?.value || '';
    const secondValue = attributes.find(({ attribute }) => attribute === secondId)?.value || '';

    return `${firstValue}${firstValue && ' '}${secondValue}`;
};

export const useTeiDisplayName = (teiId: string, programId: string) => {
    const [teiDisplayName, setTeiDisplayName] = useState('');
    const { error, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: `trackedEntityInstances/${teiId}`,
                    params: {
                        fields: ['attributes', 'trackedEntityType'],
                        program: [programId],
                    },
                },
            }),
            [teiId, programId],
        ),
    );
    useEffect(() => {
        if (data?.trackedEntityInstances?.attributes && data?.trackedEntityInstances?.trackedEntityType) {
            setTeiDisplayName(
                deriveTeiName(data.trackedEntityInstances.attributes, data.trackedEntityInstances.trackedEntityType),
            );
        }
    }, [data?.trackedEntityInstances]);

    return {
        error,
        teiDisplayName,
    };
};
