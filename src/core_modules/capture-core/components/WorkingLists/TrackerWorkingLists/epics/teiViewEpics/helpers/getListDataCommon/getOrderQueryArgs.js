// @flow
import { getFilterApiName } from '../../../../helpers';

export const DEFAULT_SORT = {
    sortById: 'createdAt',
    sortByDirection: 'desc',
};

export const getOrderQueryArgs = ({
    sortById,
    sortByDirection,
    withAPINameConverter,
}: {
    sortById: string,
    sortByDirection: string,
    withAPINameConverter?: boolean,
}) => {
    if (sortByDirection === 'default') {
        return `${DEFAULT_SORT.sortById}:${DEFAULT_SORT.sortByDirection}`;
    }

    const orderId = withAPINameConverter ? getFilterApiName(sortById) : sortById;
    return `${orderId}:${sortByDirection}`;
};
