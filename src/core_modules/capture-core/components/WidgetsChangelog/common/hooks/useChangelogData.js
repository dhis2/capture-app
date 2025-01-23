// @flow
import { useState } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import {
    CHANGELOG_ENTITY_TYPES,
    QUERY_KEYS_BY_ENTITY_TYPE,
    DEFAULT_PAGE_SIZE,
    SORT_DIRECTIONS,
    SORT_TARGETS,
} from '../Changelog/Changelog.constants';
import type { SortDirection } from '../Changelog/Changelog.types';

type Props = {
    entityId: string,
    programId?: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
};

export const useChangelogData = ({ entityId, entityType, programId }: Props) => {
    const [columnToSortBy, setColumnToSortBy] = useState<string>(SORT_TARGETS.DATE);
    const [sortDirection, setSortDirection] = useState<SortDirection>(SORT_DIRECTIONS.DEFAULT);

    const [attributeToFilterBy, setAttributeToFilterBy] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState<Object>(null);

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

    const handleChangePageSize = (newPageSize: number) => {
        setPage(1);
        setPageSize(newPageSize);
    };

    const filterParam =
        filterValue && attributeToFilterBy
            ? `${attributeToFilterBy}:eq:${filterValue.id}`
            : undefined;

    const orderParam =
        sortDirection === SORT_DIRECTIONS.DEFAULT
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
        attributeToFilterBy,
        setAttributeToFilterBy,
        filterValue,
        setFilterValue,
        page,
        pageSize,
        isLoading,
        isError,
    };
};
