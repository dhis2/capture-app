// @flow

export type Note = {
    clientId: string,
    storedBy: string,
    createdBy: ?{
        firstName: string,
        surname: string,
    },
    storedDate: string,
    value: string,
};
