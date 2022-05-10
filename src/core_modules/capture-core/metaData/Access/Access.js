// @flow
export type Access = {
    delete: boolean,
    manage: boolean,
    read: boolean,
    update: boolean,
    write: boolean,
    data: {
        read: boolean,
        write: boolean,
    },
};
