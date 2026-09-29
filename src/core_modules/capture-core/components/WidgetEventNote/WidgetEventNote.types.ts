export type Props = {
    dataEntryKey: string;
    dataEntryId: string;
    programId: string;
    stageId?: string | null;
};

export type FormNote = {
    value: string;
    createdBy: {
        firstName: string;
        surname: string;
        uid: string;
    };
    storedAt: string;
    clientId: string;
};

export type SaveContext = {
    dataEntryId: string;
    itemId: string;
    eventId: string;
    noteClientId: string;
};
