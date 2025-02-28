// @flow

export function convertOrderToClient(order?: ?string): ?string {
    if (!order) {
        return order;
    }
    console.log('orderClient: ', order);
    return order
        .replace(/eventOrgUnit/g, 'eventOrgUnitId')
        .replace(/orgUnit/g, 'orgUnitId');
}
