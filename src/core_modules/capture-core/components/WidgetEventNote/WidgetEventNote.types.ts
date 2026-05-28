export type Props = {
    dataEntryKey: string;
    dataEntryId: string;
};

export type FormNote = {
    value: string;
    lastUpdatedBy: {
        firstName: string;
        surname: string;
        uid: string;
    };
    createdBy: {
        firstName: string;
        surname: string;
        uid: string;
    };
    storedBy: string;
    storedAt: string;
    clientId: string;
};

export type SaveContext = {
    dataEntryId: string;
    itemId: string;
    eventId: string;
    noteClientId: string;
};
