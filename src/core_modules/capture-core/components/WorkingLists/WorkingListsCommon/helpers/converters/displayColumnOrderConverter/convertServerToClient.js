// @flow
export const convertServerToClient = (
    serverColumnOrder: ?Array<string>,
): Array<string> => {
    if (!serverColumnOrder) {
        return [];
    }
    return serverColumnOrder.map((columnId: string): string => {
        if (columnId === 'eventOrgUnit') {
            return 'eventOrgUnitId';
        }
        if (columnId === 'orgUnit') {
            return 'orgUnitId';
        }
        if (columnId === 'eventDate') {
            return 'occurredAt';
        }
        return columnId;
    });
};
