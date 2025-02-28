// @flow

export const convertDisplayColumnOrderToServer = (
    clientDisplayColumnOrder: ?Array<string>,
): Array<string> => {
    if (!clientDisplayColumnOrder) {
        return [];
    }

    return clientDisplayColumnOrder.map((columnId: string): string => {
        if (columnId === 'eventOrgUnitId') {
            return 'eventOrgUnit';
        }
        if (columnId === 'orgUnitId') {
            return 'orgUnit';
        }
        return columnId;
    });
};
