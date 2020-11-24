// @flow
type TeiRecord = {| [id: string]: any |};

export type TeiRecords = {| [teiId: string]: TeiRecord |};

export type TeiWorkingListsTemplate = {
    id: string,
    isDefault?: ?boolean,
    name: string,
    access: {
        update: boolean,
        delete: boolean,
        write: boolean,
        manage: boolean,
    },
    notPreserved?: boolean,
    deleted?: boolean,
    updating?: boolean,
};

export type TeiWorkingListsTemplates = Array<TeiWorkingListsTemplate>;
