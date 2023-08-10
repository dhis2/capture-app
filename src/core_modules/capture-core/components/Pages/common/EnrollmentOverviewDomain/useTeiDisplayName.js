// @flow
import { useMemo } from 'react';
import { pipe } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import { getAttributesFromScopeId } from '../../../../metaData/helpers';
import type { DataElement } from '../../../../metaData/DataElement';
import { convertServerToClient, convertClientToView } from '../../../../converters';

type Attribute = {
    valueType: string,
    attribute: string,
    value: string,
};

const convertFn = pipe(convertServerToClient, convertClientToView);

const convertValue = (attribute?: Attribute, dataElement) =>
    (attribute?.value ? convertFn(attribute.value, attribute.valueType, dataElement) : '');

const getAttributesValues = (attributes: Array<Attribute>, first?: DataElement, second?: DataElement) => {
    const firstValue = convertValue(attributes.find(({ attribute }) => attribute === first?.id), first);
    const secondValue = convertValue(attributes.find(({ attribute }) => attribute === second?.id), second);

    return firstValue || secondValue ? `${firstValue}${firstValue && ' '}${secondValue}` : '';
};

const getTetAttributesDisplayInReports = (attributes: Array<Attribute>, tetAttributes: Array<DataElement>) => {
    const [first, second] = tetAttributes.filter(({ displayInReports }) => displayInReports);
    return getAttributesValues(attributes, first, second);
};

const getTetAttributes = (attributes: Array<Attribute>, tetAttributes: Array<DataElement>) => {
    const [first, second] = tetAttributes;
    return getAttributesValues(attributes, first, second);
};

export const deriveTeiName = (attributes: Array<Attribute>, trackedEntityType: string, teiId: string) => {
    const tetAttributes = getAttributesFromScopeId(trackedEntityType);
    const teiNameDisplayInReports = getTetAttributesDisplayInReports(attributes, tetAttributes);

    if (teiNameDisplayInReports) return teiNameDisplayInReports;

    const teiName = getTetAttributes(attributes, tetAttributes);

    if (teiName) return teiName;

    return teiId;
};

export const useTeiDisplayName = (teiId: string, programId: string) => {
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

    const teiDisplayName = useMemo(
        () =>
            (data?.trackedEntities?.attributes && data?.trackedEntities?.trackedEntityType
                ? deriveTeiName(data.trackedEntities.attributes, data.trackedEntities.trackedEntityType, teiId)
                : ''),
        [data?.trackedEntities?.attributes, data?.trackedEntities?.trackedEntityType, teiId],
    );

    return {
        error,
        teiDisplayName,
    };
};
