// @flow

export const convertClientToServer = (
    displayColumnOrder: ?Array<string>,
): Array<string> => {
    if (!displayColumnOrder) {
        return [];
    }

    return displayColumnOrder.map((columnId: string): string => {
        if (columnId === 'eventOrgUnitId') {
            return 'eventOrgUnit';
        }
        if (columnId === 'orgUnitId') {
            return 'orgUnit';
        }
        if (columnId === 'occurredAt') {
            return 'eventDate';
        }
        return columnId;
    });
};
