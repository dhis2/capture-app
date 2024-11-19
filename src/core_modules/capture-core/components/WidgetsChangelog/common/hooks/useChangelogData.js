// @flow
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useMemo, useState } from 'react';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES, QUERY_KEYS_BY_ENTITY_TYPE } from '../Changelog/Changelog.constants';
import type { Change, ChangelogRecord, ItemDefinitions, SortDirection } from '../Changelog/Changelog.types';
import { convertServerToClient } from '../../../../converters';
import { convert } from '../../../../converters/clientToList';

type Props = {
    entityId: string,
    programId?: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    dataItemDefinitions: ItemDefinitions,
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = 'default';

const getMetadataItemDefinition = (
    elementKey: string,
    change: Change,
    dataItemDefinitions: ItemDefinitions,
) => {
    const { dataElement, attribute, property } = change;
    const fieldId = dataElement ?? attribute ?? property;
    const metadataElement = fieldId ? dataItemDefinitions[fieldId] : dataItemDefinitions[elementKey];

    return { metadataElement, fieldId };
};

export const useChangelogData = ({
    entityId,
    entityType,
    programId,
    dataItemDefinitions,
}: Props) => {
    const [page, setPage] = useState < number >(1);
    const [pageSize, setPageSize] = useState < number >(DEFAULT_PAGE_SIZE);
    const [sortDirection, setSortDirection] = useState < SortDirection >(DEFAULT_SORT_DIRECTION);
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
                ...{
                    order: sortDirection === DEFAULT_SORT_DIRECTION ? undefined : `createdAt:${sortDirection}`,
                },
            },
        },
        {
            enabled: !!entityId,
        },
    );

    const mockData: any = useMemo(() => [
        {
            createdAt: '2024-11-14T11:03:08.269',
            createdBy: {
                uid: 'xE7jOejl9FI',
                username: 'admin',
                firstName: 'John',
                surname: 'Traore',
            },
            type: 'UPDATE',
            change: {
                eventProperty: {
                    property: 'geometry',
                    previousValue: [-11.420051, 8.101209],
                    currentValue: [-11.450123, 8.125678],
                },
            },
        },
        {
            createdAt: '2024-11-14T11:05:47.437',
            createdBy: {
                uid: 'xE7jOejl9FI',
                username: 'admin',
                firstName: 'John',
                surname: 'Traore',
            },
            type: 'UPDATE',
            change: {
                eventProperty: {
                    property: 'geometry',
                    previousValue: [
                        [-11.437732, 8.110726],
                        [-11.396705, 8.109876],
                        [-11.398421, 8.089143],
                        [-11.414729, 8.084894],
                        [-11.436873, 8.088803],
                        [-11.437732, 8.110726],
                    ],
                    currentValue: [
                        [-11.440000, 8.120000],
                        [-11.400000, 8.115000],
                        [-11.402000, 8.095000],
                        [-11.418000, 8.090000],
                        [-11.440000, 8.120000],
                    ],
                },
            },
        },
        {
            createdAt: '2024-11-14T11:09:47.437',
            createdBy: {
                uid: 'xE7jOejl9FI',
                username: 'admin',
                firstName: 'John',
                surname: 'Traore',
            },
            type: 'UPDATE',
            change: {
                eventProperty: {
                    property: 'occurredAt',
                    previousValue: '2024-01-30T00:00:00.000',
                    currentValue: '2024-01-31T00:00:00.000',
                },
            },
        },
        {
            createdAt: '2024-11-14T11:15:00.000',
            createdBy: {
                uid: 'xE7jOejl9FI',
                username: 'admin',
                firstName: 'John',
                surname: 'Traore',
            },
            type: 'UPDATE',
            change: {
                eventProperty: {
                    property: 'scheduledAt',
                    previousValue: '2024-01-29T00:00:00.000',
                    currentValue: '2024-01-30T00:00:00.000',
                },
            },
        },
        {
            createdAt: '2019-09-27T00:02:11.604',
            createdBy: {
                uid: 'AIK2aQOJIbj',
                username: 'tracker',
                firstName: 'Tracker name',
                surname: 'Tracker surname',
            },
            type: 'UPDATE',
            change: {
                dataValue: {
                    dataElement: 'X8zyunlgUfM',
                    previousValue: 'Replacement',
                    currentValue: 'Fresh',
                },
            },
        },
    ], []);


    const records: ?Array<ChangelogRecord> = useMemo(() => {
        if (!data) return undefined;

        return mockData.map((changelog) => {
            const { change: apiChange, createdAt, createdBy } = changelog;
            const elementKey = Object.keys(apiChange)[0];
            const change = apiChange[elementKey];

            const { metadataElement, fieldId } = getMetadataItemDefinition(
                elementKey,
                change,
                dataItemDefinitions,
            );

            if (!metadataElement) {
                log.error(errorCreator('Could not find metadata for element')({
                    ...changelog,
                }));
                return null;
            }

            const { firstName, surname, username } = createdBy;
            const { options } = metadataElement;

            const previousValue = convert(
                convertServerToClient(change.previousValue, metadataElement.type),
                metadataElement.type,
                options,
            );

            const currentValue = convert(
                convertServerToClient(change.currentValue, metadataElement.type),
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
        }).filter(Boolean);
    }, [data, dataItemDefinitions, fromServerDate, mockData]);

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
