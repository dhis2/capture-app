// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import { useTimeZoneConversion, useConfig, useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from 'react-query';
import { errorCreator, buildUrl, pipe } from 'capture-core-utils';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import { dataElementTypes } from '../../../../metaData';
import { CHANGELOG_ENTITY_TYPES } from '../Changelog/Changelog.constants';
import type { Change, ItemDefinitions, SortDirection } from '../Changelog/Changelog.types';
import { convertServerToClient } from '../../../../converters';
import { convert as convertClientToList } from '../../../../converters/clientToList';
import { RECORD_TYPE, subValueGetterByElementType } from '../utils/getSubValueForChangelogData';
import { makeQuerySingleResource } from '../../../../utils/api';
import { attributeOptionsKey } from '../../../DataEntryDhis2Helpers';


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

    const getMetadataItemDefinition = (
        elementKey: string,
        change: Change,
    ) => {
        const fieldId = change.dataElement || change.attribute;
        if (!fieldId) {
            log.error('Could not find fieldId in change:', change);
            return { metadataElement: null, fieldId: null };
        }
        const metadataElement = dataItemDefinitions[fieldId];
        return { metadataElement, fieldId };
    };


    const fetchedRecords = await Promise.all(
        rawRecords.changeLogs.map(async (changelog) => {
            const { change: apiChange, createdAt, createdBy, type } = changelog;
            const elementKey = Object.keys(apiChange)[0];
            const change = apiChange[elementKey];

            const { metadataElement, fieldId } = getMetadataItemDefinition(
                elementKey,
                change,
            );

            if (!metadataElement) {
                log.error(
                    errorCreator('Could not find metadata for element')({ ...changelog }),
                );
                return null;
            }

            const getSubValue = subValueGetterByElementType[RECORD_TYPE[entityType]]?.[metadataElement.type];

            const getValue = async (value, latestValue) => {
                if (!getSubValue) {
                    return convertServerToClient(value, metadataElement.type);
                }
                if (entityType === RECORD_TYPE.trackedEntity) {
                    return getSubValue({
                        trackedEntity: { teiId: entityId, value },
                        programId,
                        attributeId: fieldId,
                        absoluteApiPath,
                        querySingleResource,
                        latestValue,
                    });
                }
                if (entityType === RECORD_TYPE.event) {
                    return getSubValue({
                        dataElement: { id: fieldId, value },
                        eventId: entityId,
                        absoluteApiPath,
                        querySingleResource,
                        latestValue,
                    });
                }
                return null;
            };

            const [previousValueClient, currentValueClient] = await Promise.all([
                change.previousValue ? getValue(change.previousValue, false) : null,
                getValue(change.currentValue, entityData?.[change.attribute ?? change.dataElement]?.value === change.currentValue),
            ]);

            const { firstName, surname, username } = createdBy;
            const { options } = metadataElement;

            const previousValue = convertClientToList(previousValueClient, metadataElement.type, options);
            const currentValue = convertClientToList(currentValueClient, metadataElement.type, options);

            return {
                reactKey: fieldId ? `${createdAt}-${fieldId}` : attributeOptionsKey,
                date: pipe(convertServerToClient, convertClientToList)(fromServerDate(createdAt), dataElementTypes.DATETIME),
                user: `${firstName} ${surname} (${username})`,
                changeType: type,
                dataItemLabel: metadataElement.name,
                previousValue,
                currentValue,
            };
        }),
    );

    return fetchedRecords.filter(Boolean);
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
    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);

    const querySingleResource = useMemo(
        () => makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        [dataEngine],
    );

    const queryKey = [ReactQueryAppNamespace, 'changelog', entityType, entityId, 'formattedData', { sortDirection, page, pageSize, programId }];

    const { data: processedRecords, isError, isLoading } = useQuery(
        queryKey,
        () => fetchFormattedValues({
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

    return {
        processedRecords,
        isError,
        isLoading,
    };
};