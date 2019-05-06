// @flow

export default function getDataEntryKey(dataEntryId: string, itemId: string) {
    return `${dataEntryId}-${itemId}`;
}