// @flow
import { useState } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import {
    CHANGELOG_ENTITY_TYPES,
    QUERY_KEYS_BY_ENTITY_TYPE,
    DEFAULT_PAGE_SIZE,
    SORT_DIRECTION,
    COLUMN_TO_SORT_BY,
} from '../Changelog/Changelog.constants';
import type { SortDirection } from '../Changelog/Changelog.types';

type Props = {
    entityId: string,
    programId?: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
};

export const useChangelogData = ({ entityId, entityType, programId }: Props) => {
    const [columnToSortBy, setColumnToSortBy] = useState<string>(COLUMN_TO_SORT_BY.DATE);
    const [sortDirection, setSortDirection] = useState<SortDirection>(SORT_DIRECTION.DEFAULT);

    const [fieldToFilterBy, setfieldToFilterBy] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState<Object>('Show all');

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

    const handleChangePageSize = (newPageSize: number) => {
        setPage(1);
        setPageSize(newPageSize);
    };

    const filterParam =
        filterValue !== 'Show all' && fieldToFilterBy
            ? `${fieldToFilterBy}:eq:${filterValue.id}`
            : undefined;

    const orderParam =
        sortDirection === SORT_DIRECTION.DEFAULT
            ? undefined
            : `${columnToSortBy}:${sortDirection}`;

    const { data, isLoading, isError } = useApiDataQuery(
        [
            'changelog',
            entityType,
            entityId,
            'rawData',
            { columnToSortBy, sortDirection, page, pageSize, programId, filterParam },
        ],
        {
            resource: `tracker/${QUERY_KEYS_BY_ENTITY_TYPE[entityType]}/${entityId}/changeLogs`,
            params: {
                page,
                pageSize,
                program: programId,
                filter: filterParam,
                order: orderParam,
            },
        },
        { enabled: !!entityId },
    );

    return {
        rawRecords: data,
        pager: data?.pager,
        setPage,
        setPageSize: handleChangePageSize,
        sortDirection,
        setSortDirection,
        columnToSortBy,
        setColumnToSortBy,
        fieldToFilterBy,
        setfieldToFilterBy,
        filterValue,
        setFilterValue,
        page,
        pageSize,
        isLoading,
        isError,
    };
};
