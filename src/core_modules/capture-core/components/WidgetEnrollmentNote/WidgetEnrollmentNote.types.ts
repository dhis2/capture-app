export type Props = {
};

export type ClientNote = {
    value: string;
    createdBy: {
        firstName: string;
        surname: string;
        uid: string;
    };
    storedBy: string;
    storedAt: string;
};

export type SaveContext = {
    enrollmentId: string;
    noteClientId: string;
};
