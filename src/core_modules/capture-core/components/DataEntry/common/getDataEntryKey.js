// @flow

export function getDataEntryKey(dataEntryId: string, itemId: string) {
    return `${dataEntryId}-${itemId}`;
}
