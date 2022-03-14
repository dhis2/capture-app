// @flow
export const convertValue = (order: ?string) => {
    const sortOrderParts = order && order.split(':');
    if (!sortOrderParts || sortOrderParts.length !== 2) {
        return {
            sortById: 'regDate',
            sortByDirection: 'desc',
        };
    }

    return {
        sortById: sortOrderParts[0],
        sortByDirection: sortOrderParts[1],
    };
};
