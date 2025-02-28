// @flow

export const convertOrderToServer = (order?: ?string): ?string => {
    if (!order) {
        return order;
    }
    console.log('orderServer: ', order);
    return order
        .replace(/eventOrgUnitId/g, 'eventOrgUnit')
        .replace(/orgUnitId/g, 'orgUnit');
};
