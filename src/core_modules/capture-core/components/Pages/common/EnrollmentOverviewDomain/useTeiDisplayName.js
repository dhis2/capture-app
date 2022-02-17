// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { getAttributesFromScopeId } from '../../../../metaData/helpers';
import type { DataElement } from '../../../../metaData/DataElement';

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
                trackedEntities: {
                    resource: `tracker/trackedEntities/${teiId}`,
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
        if (data?.trackedEntities?.attributes && data?.trackedEntities?.trackedEntityType) {
            setTeiDisplayName(
                deriveTeiName(
                    data.trackedEntities.attributes,
                    data.trackedEntities.trackedEntityType,
                    teiId,
                ),
            );
        }
    }, [data?.trackedEntities, teiId]);

    return {
        error,
        teiDisplayName,
    };
};
