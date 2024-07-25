// @flow
import { getFilterApiName } from '../../../../helpers';

export const DEFAULT_SORT = {
    sortById: 'createdAt',
    sortByDirection: 'desc',
};

export const getOrderQueryArgs = (sortById: string, sortByDirection: string, withAPINameConverter?: boolean) => {
    const orderId = withAPINameConverter ? getFilterApiName(sortById) : sortById;

    if (sortByDirection === 'default') {
        return `${DEFAULT_SORT.sortById}:${DEFAULT_SORT.sortByDirection}`;
    }
    return `${orderId}:${sortByDirection}`;
};
