export type Note = {
    clientId: string;
    createdBy?: {
        firstName: string;
        surname: string;
    };
    storedAt: string;
    value: string;
};
