// @flow
export const convertServerToClient = (
    serverColumnOrder: ?Array<string>,
): Array<string> => {
    if (!serverColumnOrder) {
        return [];
    }
    return serverColumnOrder.map((columnId: string): string => {
        if (columnId === 'eventDate') {
            return 'occurredAt';
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
