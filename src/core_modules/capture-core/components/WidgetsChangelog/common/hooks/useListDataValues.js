// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import { useTimeZoneConversion, useConfig, useDataEngine } from '@dhis2/app-runtime';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import { useQuery } from 'react-query';
import { buildUrl, pipe } from 'capture-core-utils';
import { convertServerToClient } from '../../../../converters';
import { convert as convertClientToList } from '../../../../converters/clientToList';
import { dataElementTypes } from '../../../../metaData';
import { CHANGELOG_ENTITY_TYPES } from '../Changelog/Changelog.constants';
import type {
    Change,
    ItemDefinitions,
    SortDirection,
} from '../Changelog/Changelog.types';
import { subValueGetterByElementType, RECORD_TYPE } from '../utils/getSubValueForChangelogData';
import { makeQuerySingleResource } from '../../../../utils/api';

type Props = {
    rawRecords: Object,
    dataItemDefinitions: ItemDefinitions,
    entityId: string,
    entityData: Object,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    programId?: string,
    sortDirection: SortDirection,
    page: number,
    pageSize: number,
};

const fetchFormattedValues = async ({
    rawRecords,
    dataItemDefinitions,
    entityId,
    entityData,
    entityType,
    programId,
    absoluteApiPath,
    querySingleResource,
    fromServerDate,
}) => {
    if (!rawRecords) return [];

    // Hjelpefunksjon for å hente riktig metadata
    const getItemDefinition = (change: Change) => {
        const fieldId = change.dataElement ?? change.attribute ?? change.field;
        if (!fieldId) {
            log.error('Ingen felt-id i endringen:', change);
            return null;
        }
        return dataItemDefinitions[fieldId];
    };

    const results = await Promise.all(
        rawRecords.changeLogs.map(async (changelog) => {
            const { change: apiChange, createdAt, createdBy, type } = changelog;
            const elementKey = Object.keys(apiChange)[0];
            const change = apiChange[elementKey];

            const metadataElement = getItemDefinition(change);
            if (!metadataElement) {
                log.error('Fant ikke metadata for element:', changelog);
                return null;
            }

            const getSubValue = subValueGetterByElementType[RECORD_TYPE[entityType]]?.[metadataElement.type];

            const getValue = async (value, isLatestValue) => {
                // Standardkonvertering hvis ingen spesialhåndtering er nødvendig
                if (!getSubValue) {
                    return convertServerToClient(value, metadataElement.type);
                }

                // Ellers la subValueGetter hente f.eks. OptionLabel, Relationship, osv.
                if (entityType === RECORD_TYPE.trackedEntity) {
                    return getSubValue({
                        trackedEntity: { teiId: entityId, value },
                        programId,
                        attributeId: metadataElement.id,
                        absoluteApiPath,
                        querySingleResource,
                        latestValue: isLatestValue,
                    });
                }
                if (entityType === RECORD_TYPE.event) {
                    return getSubValue({
                        dataElement: { id: metadataElement.id, value },
                        eventId: entityId,
                        absoluteApiPath,
                        querySingleResource,
                        latestValue: isLatestValue,
                    });
                }
                return null;
            };

            const [previousValueClient, currentValueClient] = await Promise.all([
                change.previousValue ? getValue(change.previousValue, false) : null,
                getValue(
                    change.currentValue,
                    entityData?.[change.attribute ?? change.dataElement]?.value === change.currentValue,
                ),
            ]);

            const { firstName, surname, username } = createdBy;
            const { options } = metadataElement;

            const previousValue = convertClientToList(previousValueClient, metadataElement.type, options);
            const currentValue = convertClientToList(currentValueClient, metadataElement.type, options);

            return {
                reactKey: metadataElement.id ? `${createdAt}-${metadataElement.id}` : createdAt,
                date: pipe(convertServerToClient, convertClientToList)(
                    fromServerDate(createdAt),
                    dataElementTypes.DATETIME,
                ),
                user: `${firstName} ${surname} (${username})`,
                username,
                dataItemId: metadataElement.id,
                changeType: type,
                dataItemLabel: metadataElement.name,
                previousValue,
                currentValue,
            };
        }),
    );

    // Fjern tomme/null-linjer:
    return results.filter(Boolean);
};

export const useListDataValues = ({
    rawRecords,
    dataItemDefinitions,
    entityId,
    entityData,
    entityType,
    programId,
    sortDirection,
    page,
    pageSize,
}: Props) => {
    const dataEngine = useDataEngine();
    const { baseUrl, apiVersion } = useConfig();
    const { fromServerDate } = useTimeZoneConversion();

    // Bygg absolutt API-path
    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);

    // Klargjør en "Single resource"-spørring
    const querySingleResource = useMemo(
        () => makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        [dataEngine],
    );

    const queryKey = [
        ReactQueryAppNamespace,
        'changelog',
        entityType,
        entityId,
        'formattedData',
        { sortDirection, page, pageSize, programId, rawRecords },
    ];

    const { data: processedRecords, isError, isLoading } = useQuery(
        queryKey,
        () =>
            fetchFormattedValues({
                rawRecords,
                dataItemDefinitions,
                entityId,
                entityData,
                entityType,
                programId,
                absoluteApiPath,
                querySingleResource,
                fromServerDate,
            }),
        {
            enabled: !!rawRecords && !!dataItemDefinitions && !!entityId && !!entityType,
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    );

    return { processedRecords, isLoading, isError };
};
