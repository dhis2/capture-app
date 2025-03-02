// @flow
export const convertDisplayColumnOrderToClient = (
    serverDisplayColumnOrder: ?Array<string>,
): Array<string> => {
    if (!serverDisplayColumnOrder) {
        return [];
    }
    return serverDisplayColumnOrder.map((columnId: string): string => {
        if (columnId === 'eventOrgUnit') {
            return 'eventOrgUnitId';
        }
        return columnId;
    });
};
