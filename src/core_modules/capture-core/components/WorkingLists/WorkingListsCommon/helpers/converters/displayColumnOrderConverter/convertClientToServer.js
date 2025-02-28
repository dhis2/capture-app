// @flow

export const convertClientToServer = (
    clientColumnOrder: ?Array<string>,
): Array<string> => {
    if (!clientColumnOrder) {
        return [];
    }

    return clientColumnOrder.map((columnId: string): string => {
        if (columnId === 'eventOrgUnitId') {
            return 'eventOrgUnit';
        }
        if (columnId === 'orgUnitId') {
            return 'orgUnit';
        }
        return columnId;
    });
};
