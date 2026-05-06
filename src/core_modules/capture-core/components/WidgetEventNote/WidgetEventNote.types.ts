export type Props = {
    dataEntryKey: string;
    dataEntryId: string;
    stageWriteAccess?: boolean;
};

export type ClientNote = {
    value: string;
    lastUpdatedBy: {
        firstName: string;
        surname: string;
        uid: string;
    };
    storedBy: string;
    storedAt: string;
};

export type FormNote = ClientNote & {
    createdBy: {
        firstName: string;
        surname: string;
        uid: string;
    };
};

export type SaveContext = {
    dataEntryId: string;
    itemId: string;
    eventId: string;
    noteClientId: string;
};
