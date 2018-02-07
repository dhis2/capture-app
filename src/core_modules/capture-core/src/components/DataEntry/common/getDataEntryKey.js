// @flow

export default function getDataEntryKey(dataEntryId: string, eventId: string) {
    return `${dataEntryId}-${eventId}`;
}