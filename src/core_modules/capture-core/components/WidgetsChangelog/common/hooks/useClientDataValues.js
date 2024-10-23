// @flow
import { useMemo } from 'react';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import log from 'loglevel';
import { useTimeZoneConversion, useConfig, useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from 'react-query';
import { errorCreator, buildUrl, pipe } from 'capture-core-utils';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import { dataElementTypes } from '../../../../metaData';
import { CHANGELOG_ENTITY_TYPES } from '../Changelog/Changelog.constants';
import type { Change, ItemDefinitions, SortDirection } from '../Changelog/Changelog.types';
import { convertServerToClient, convertClientToView } from '../../../../converters';
import { convert } from '../../../../converters/clientToList';
import { RECORD_TYPE, subValueGetterByElementType } from '../utils/getSubValueForChangelogData';
import { makeQuerySingleResource } from '../../../../utils/api';

const convertFn = pipe(convertServerToClient, convertClientToView);

type Props = {
    rawRecords: Object,
    dataItemDefinitions: ItemDefinitions,
    entityId: string,
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
    entityType,
    programId,
    absoluteApiPath,
    querySingleResource,
    fromServerDate,
}) => {
    if (!rawRecords) return [];

    const mostRecentCreatedAtByFieldId = rawRecords.changeLogs.reduce((acc, record) => {
        const elementKey = Object.keys(record.change)[0];
        const fieldId = record.change[elementKey]?.dataElement ?? record.change[elementKey]?.attribute;

        if (!acc[fieldId] || moment(record.createdAt).isAfter(acc[fieldId])) {
            acc[fieldId] = record.createdAt;
        }
        return acc;
    }, {});

    const getMetadataItemDefinition = (
        elementKey: string,
        change: Change,
        dataItem: ItemDefinitions,
    ) => {
        const { dataElement, attribute } = change;
        const fieldId = dataElement ?? attribute;
        const metadataElement = fieldId ? dataItem[fieldId] : dataItem[elementKey];
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
                dataItemDefinitions,
            );

            if (!metadataElement) {
                log.error(
                    errorCreator('Could not find metadata for element')({ ...changelog }),
                );
                return null;
            }

            const getSubValue =
                subValueGetterByElementType[RECORD_TYPE[entityType]]?.[metadataElement.type];

            const isLatestValue =
                moment(createdAt).isSameOrAfter(mostRecentCreatedAtByFieldId[fieldId]);

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

            const [previousValueRaw, currentValueRaw] = await Promise.all([
                change.previousValue ? getValue(change.previousValue, false) : null,
                getValue(change.currentValue, isLatestValue),
            ]);

            const { firstName, surname, username } = createdBy;
            const { options } = metadataElement;

            const previousValue = convert(previousValueRaw, metadataElement.type, options);
            const currentValue = convert(currentValueRaw, metadataElement.type, options);

            return {
                reactKey: uuid(),
                date: convertFn(fromServerDate(createdAt), dataElementTypes.DATETIME),
                user: `${firstName} ${surname} (${username})`,
                dataItemId: fieldId,
                changeType: type,
                dataItemLabel: metadataElement.name,
                previousValue,
                currentValue,
            };
        }),
    );

    return fetchedRecords.filter(Boolean);
};

export const useClientDataValues = ({
    rawRecords,
    dataItemDefinitions,
    entityId,
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
