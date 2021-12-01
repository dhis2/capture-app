// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo, useEffect, useState } from 'react';
import type { DataElement } from '../../../../metaData/DataElement';
import { getAttributesFromScopeId } from '../../../../metaData/helpers';

const getAttributesValues = (attributes, firstId, secondId) => {
    const firstValue = attributes.find(({ attribute }) => attribute === firstId)?.value || '';
    const secondValue = attributes.find(({ attribute }) => attribute === secondId)?.value || '';

    return firstValue || secondValue ? `${firstValue}${firstValue && ' '}${secondValue}` : '';
};

const getTetAttributesDisplayInReports = (attributes: Array<any>, tetAttributes: Array<DataElement>) => {
    const [firstId, secondId] = tetAttributes.filter(({ displayInReports }) => displayInReports).map(({ id }) => id);
    return getAttributesValues(attributes, firstId, secondId);
};

const getTetAttributes = (attributes: Array<any>, tetAttributes: Array<DataElement>) => {
    const [firstId, secondId] = tetAttributes.map(({ id }) => id);
    return getAttributesValues(attributes, firstId, secondId);
};

export const deriveTeiName = (attributes: Array<any>, trackedEntityType: string, teiId: string) => {
    const tetAttributes = getAttributesFromScopeId(trackedEntityType);
    const teiNameDisplayInReports = getTetAttributesDisplayInReports(attributes, tetAttributes);

    if (teiNameDisplayInReports) return teiNameDisplayInReports;

    const teiName = getTetAttributes(attributes, tetAttributes);

    if (teiName) return teiName;

    return teiId;
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
                deriveTeiName(
                    data.trackedEntityInstances.attributes,
                    data.trackedEntityInstances.trackedEntityType,
                    teiId,
                ),
            );
        }
    }, [data?.trackedEntityInstances, teiId]);

    return {
        error,
        teiDisplayName,
    };
};
