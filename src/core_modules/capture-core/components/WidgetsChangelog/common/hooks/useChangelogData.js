// @flow
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import log from 'loglevel';
import { errorCreator, buildUrl } from 'capture-core-utils';
import { useState, useEffect, useMemo } from 'react';
import { useTimeZoneConversion, useConfig, useDataEngine } from '@dhis2/app-runtime';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES, QUERY_KEYS_BY_ENTITY_TYPE } from '../Changelog/Changelog.constants';
import type { Change, ChangelogRecord, ItemDefinitions, SortDirection } from '../Changelog/Changelog.types';
import { convertServerToClient } from '../../../../converters';
import { convert } from '../../../../converters/clientToList';
import { RECORD_TYPE, subValueGetterByElementType } from '../utils/getSubValueForChangelogData';
import { makeQuerySingleResource } from '../../../../utils/api';

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

    // Memoize the bound query function
    const query = useMemo(() => dataEngine.query.bind(dataEngine), [dataEngine]);

    // Create querySingleResource using the memoized query
    const querySingleResource = useMemo(() => makeQuerySingleResource(query), [query]);

    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
    const { fromServerDate } = useTimeZoneConversion();

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
                order: sortDirection === DEFAULT_SORT_DIRECTION ? undefined : `createdAt:${sortDirection}`,
            },
        },
        {
            enabled: !!entityId,
        },
    );

    const [records, setRecords] = useState<?Array<ChangelogRecord>>(undefined);

    useEffect(() => {
        const fetchRecords = async () => {
            if (!data) return;

            const fetchedRecords = await Promise.all(
                data.changeLogs
                    .map(async (changelog) => {
                        const { change: apiChange, createdAt, createdBy } = changelog;
                        const elementKey = Object.keys(apiChange)[0];
                        const change = apiChange[elementKey];

                        const { metadataElement, fieldId } = getMetadataItemDefinition(
                            elementKey,
                            change,
                            dataItemDefinitions,
                        );

                        if (!metadataElement) {
                            log.error(
                                errorCreator('Could not find metadata for element')({
                                    ...changelog,
                                }),
                            );
                            return null;
                        }

                        let previousValueRaw;
                        let currentValueRaw;

                        const urls =
                            subValueGetterByElementType[RECORD_TYPE[entityType]]?.[metadataElement.type];

                        if (urls) {
                            if (entityType === RECORD_TYPE.trackedEntity) {
                                previousValueRaw = change.previousValue
                                    ? await urls({
                                        trackedEntity: {
                                            teiId: entityId,
                                            value: change.previousValue,
                                        },
                                        programId,
                                        attributeId: fieldId,
                                        absoluteApiPath,
                                        querySingleResource,
                                        isPreviousValue: true,
                                    })
                                    : null;
                                currentValueRaw = await urls({
                                    trackedEntity: {
                                        teiId: entityId,
                                        value: change.currentValue,
                                    },
                                    programId,
                                    attributeId: fieldId,
                                    absoluteApiPath,
                                    querySingleResource,
                                });
                            } else if (entityType === RECORD_TYPE.event) {
                                previousValueRaw = change.previousValue
                                    ? await urls({
                                        dataElement: {
                                            id: fieldId,
                                            value: change.previousValue,
                                        },
                                        eventId: entityId,
                                        absoluteApiPath,
                                        querySingleResource,
                                        isPreviousValue: true,
                                    })
                                    : null;
                                currentValueRaw = await urls({
                                    dataElement: {
                                        id: fieldId,
                                        value: change.currentValue,
                                    },
                                    eventId: entityId,
                                    absoluteApiPath,
                                    querySingleResource,
                                });
                            }
                        } else {
                            previousValueRaw = convertServerToClient(
                                change.previousValue,
                                metadataElement.type,
                            );
                            currentValueRaw = convertServerToClient(
                                change.currentValue,
                                metadataElement.type,
                            );
                        }

                        const { firstName, surname, username } = createdBy;
                        const { options } = metadataElement;

                        const previousValue = convert(
                            previousValueRaw,
                            metadataElement.type,
                            options,
                        );

                        const currentValue = convert(
                            currentValueRaw,
                            metadataElement.type,
                            options,
                        );

                        return {
                            reactKey: uuid(),
                            date: moment(fromServerDate(createdAt)).format('YYYY-MM-DD HH:mm'),
                            user: `${firstName} ${surname} (${username})`,
                            dataItemId: fieldId,
                            changeType: changelog.type,
                            dataItemLabel: metadataElement.name,
                            previousValue,
                            currentValue,
                        };
                    })
                    .filter(Boolean),
            );

            setRecords(fetchedRecords);
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

    console.log('records', records);

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
