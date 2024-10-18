// @flow
import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import log from 'loglevel';
import { useTimeZoneConversion, useConfig, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator, buildUrl, pipe } from 'capture-core-utils';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import { dataElementTypes } from '../../../../metaData';
import {
    CHANGELOG_ENTITY_TYPES,
    QUERY_KEYS_BY_ENTITY_TYPE,
} from '../Changelog/Changelog.constants';
import type {
    Change,
    ChangelogRecord,
    ItemDefinitions,
    SortDirection,
} from '../Changelog/Changelog.types';
import { convertServerToClient, convertClientToView } from '../../../../converters';
import { convert } from '../../../../converters/clientToList';
import {
    RECORD_TYPE,
    subValueGetterByElementType,
} from '../utils/getSubValueForChangelogData';
import { makeQuerySingleResource } from '../../../../utils/api';

const convertFn = pipe(convertServerToClient, convertClientToView);

type Props = {
    entityId: string,
    programId?: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    dataItemDefinitions: ItemDefinitions,
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = 'default';

const getMetadataItemDefinition = (
    elementKey: string,
    change: Change,
    dataItemDefinitions: ItemDefinitions,
) => {
    const { dataElement, attribute } = change;
    const fieldId = dataElement ?? attribute;
    const metadataElement = fieldId ? dataItemDefinitions[fieldId] : dataItemDefinitions[elementKey];

    return { metadataElement, fieldId };
};

export const useChangelogData = ({
    entityId,
    entityType,
    programId,
    dataItemDefinitions,
}: Props) => {
    const dataEngine = useDataEngine();
    const { baseUrl, apiVersion } = useConfig();
    const { fromServerDate } = useTimeZoneConversion();
    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
    const [records, setRecords] = useState<?Array<ChangelogRecord>>(undefined);

    const querySingleResource = useMemo(
        () => makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        [dataEngine],
    );

    const handleChangePageSize = (newPageSize: number) => {
        setPage(1);
        setPageSize(newPageSize);
    };

    const { data, isLoading, isError } = useApiDataQuery(
        ['changelog', entityType, entityId, { sortDirection, page, pageSize, programId }],
        {
            resource: `tracker/${QUERY_KEYS_BY_ENTITY_TYPE[entityType]}/${entityId}/changeLogs`,
            params: {
                page,
                pageSize,
                program: programId,
                ...{
                    order: sortDirection === DEFAULT_SORT_DIRECTION ? undefined : `createdAt:${sortDirection}`,
                },
            },
        },
        {
            enabled: !!entityId,
        },
    );

    useEffect(() => {
        const fetchRecords = async () => {
            if (!data) return;

            const mostRecentCreatedAtByFieldId = data.changeLogs.reduce((acc, record) => {
                const elementKey = Object.keys(record.change)[0];
                const fieldId = record.change[elementKey]?.dataElement ?? record.change[elementKey]?.attribute;

                if (!acc[fieldId] || moment(record.createdAt).isAfter(acc[fieldId])) {
                    acc[fieldId] = record.createdAt;
                }
                return acc;
            }, {});

            const fetchedRecords = await Promise.all(
                data.changeLogs.map(async (changelog) => {
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

            setRecords(fetchedRecords.filter(Boolean));
        };

        fetchRecords();
    }, [
        data,
        dataItemDefinitions,
        fromServerDate,
        entityId,
        entityType,
        programId,
        absoluteApiPath,
        querySingleResource,
    ]);

    return {
        records,
        pager: data?.pager,
        setPage,
        setPageSize: handleChangePageSize,
        sortDirection,
        setSortDirection,
        isLoading,
        isError,
    };
};
