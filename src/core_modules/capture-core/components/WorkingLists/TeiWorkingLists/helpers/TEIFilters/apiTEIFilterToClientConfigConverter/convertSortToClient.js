// @flow
import type { TeiColumnsMetaForDataFetching } from '../../../types';
import { DEFAULT_SORT } from '../../../epics';


export const convertSortOrder = (order: ?string, columnsMetaForDataFetching?: TeiColumnsMetaForDataFetching) => {
    const sortOrderParts = order && order.split(':');
    if (!sortOrderParts || sortOrderParts.length < 2) {
        return DEFAULT_SORT;
    }
    const sortById = sortOrderParts[0];
    const sortByDirection = sortOrderParts[1];

    const sortByColumn = columnsMetaForDataFetching && ([...columnsMetaForDataFetching.entries()]
        .find(([, { apiViewName }]) => apiViewName && apiViewName === sortById)
        ?.[1] ||
        columnsMetaForDataFetching?.get(sortById));

    if (!sortByColumn?.id) {
        return DEFAULT_SORT;
    }

    return {
        sortById: sortByColumn.id,
        sortByDirection,
    };
};
