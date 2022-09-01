// @flow
export type WorkingListTemplate = {
    id: string,
    displayName: string,
    access: {
        update: boolean,
        delete: boolean,
        write: boolean,
        manage: boolean,
    },
    sortOrder?: number,
};

export type WorkingListTemplates = Array<WorkingListTemplate>;
