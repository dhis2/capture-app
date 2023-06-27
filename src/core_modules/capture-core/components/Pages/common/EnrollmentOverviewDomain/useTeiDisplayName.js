// @flow
import { useMemo } from 'react';
import { pipe } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import { getAttributesFromScopeId } from '../../../../metaData/helpers';
import type { DataElement } from '../../../../metaData/DataElement';
import { getTrackerProgramThrowIfNotFound } from '../../../../metaData';
import { convertServerToClient, convertClientToView } from '../../../../converters';

type Attribute = {
    valueType: string,
    attribute: string,
    value: string,
};

const convertFn = pipe(convertServerToClient, convertClientToView);

const convertValue = (attribute?: Attribute, programId: string) => {
    if (attribute?.value) {
        const program = getTrackerProgramThrowIfNotFound(programId);
        const dataElement = program.attributes.find(dL => dL.id === attribute.attribute);
        return convertFn(attribute.value, attribute.valueType, dataElement);
    }
    return '';
};

const getAttributesValues = (attributes: Array<Attribute>, firstId: string, secondId: string, programId: string) => {
    const firstValue = convertValue(attributes.find(({ attribute }) => attribute === firstId), programId);
    const secondValue = convertValue(attributes.find(({ attribute }) => attribute === secondId), programId);

    return firstValue || secondValue ? `${firstValue}${firstValue && ' '}${secondValue}` : '';
};

const getTetAttributesDisplayInReports = (
    attributes: Array<Attribute>,
    tetAttributes: Array<DataElement>,
    programId: string,
) => {
    const [firstId, secondId] = tetAttributes.filter(({ displayInReports }) => displayInReports).map(({ id }) => id);
    return getAttributesValues(attributes, firstId, secondId, programId);
};

const getTetAttributes = (attributes: Array<Attribute>, tetAttributes: Array<DataElement>, programId: string) => {
    const [firstId, secondId] = tetAttributes.map(({ id }) => id);
    return getAttributesValues(attributes, firstId, secondId, programId);
};

export const deriveTeiName = ({
    attributes,
    trackedEntityType,
    teiId,
    programId,
}: {attributes: Array<Attribute>,
    trackedEntityType: string,
    teiId: string,
    programId: string,
    },
) => {
    const tetAttributes = getAttributesFromScopeId(trackedEntityType);
    const teiNameDisplayInReports = getTetAttributesDisplayInReports(attributes, tetAttributes, programId);

    if (teiNameDisplayInReports) return teiNameDisplayInReports;

    const teiName = getTetAttributes(attributes, tetAttributes, programId);

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
                ? deriveTeiName({
                    attributes: data.trackedEntities.attributes,
                    trackedEntityType: data.trackedEntities.trackedEntityType,
                    teiId,
                    programId,
                },
                )
                : ''),
        [data?.trackedEntities?.attributes, data?.trackedEntities?.trackedEntityType, teiId, programId],
    );

    return {
        error,
        teiDisplayName,
    };
};
