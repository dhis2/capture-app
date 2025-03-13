// @flow

export type Note = {
    clientId: string,
    storedBy: string,
    createdBy: ?{
        firstName: string,
        surname: string,
    },
    storedAt: string,
    value: string,
};
