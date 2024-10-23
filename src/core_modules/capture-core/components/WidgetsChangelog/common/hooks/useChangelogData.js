// @flow
import { useState } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import {
    CHANGELOG_ENTITY_TYPES,
    QUERY_KEYS_BY_ENTITY_TYPE,
} from '../Changelog/Changelog.constants';
import type {
    SortDirection,
} from '../Changelog/Changelog.types';

type Props = {
    entityId: string,
    programId?: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = 'default';

export const useChangelogData = ({
    entityId,
    entityType,
    programId,
}: Props) => {
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

    const handleChangePageSize = (newPageSize: number) => {
        setPage(1);
        setPageSize(newPageSize);
    };

    const { data, isLoading, isError } = useApiDataQuery(
        ['changelog', entityType, entityId, 'rawData', { sortDirection, page, pageSize, programId }],
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

    return {
        rawRecords: data,
        pager: data?.pager,
        setPage,
        setPageSize: handleChangePageSize,
        sortDirection,
        setSortDirection,
        page,
        pageSize,
        isLoading,
        isError,
    };
};
