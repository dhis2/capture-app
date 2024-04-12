// @flow
import type { TeiColumnsMetaForDataFetching } from '../../../types';

const DEFAULT_SORT = {
    sortById: 'createdAt',
    sortByDirection: 'desc',
};

export const convertSortOrder = (order: ?string, columnsMetaForDataFetching?: TeiColumnsMetaForDataFetching) => {
    const sortOrderParts = order && order.split(':');
    if (!sortOrderParts || sortOrderParts.length < 2) {
        return DEFAULT_SORT;
    }
    const sortById = sortOrderParts[0];
    const sortByDirection = sortOrderParts[1];

    if (!columnsMetaForDataFetching?.get(sortById)?.id) {
        return DEFAULT_SORT;
    }

    return {
        sortById,
        sortByDirection,
    };
};
