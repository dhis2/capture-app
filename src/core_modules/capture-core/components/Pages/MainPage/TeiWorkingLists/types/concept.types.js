// @flow
import { typeof dataElementTypes } from '../../../../../metaData';

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

export type ColumnConfigBase = {
    id: string,
    visible: boolean,
    type: $Values<dataElementTypes>,
    header: string,
    options?: ?Array<{text: string, value: any}>,
    multiValueFilter?: boolean,
};

export type TeiWorkingListsColumnConfig = ColumnConfigBase;

export type TeiWorkingListsColumnConfigs = Array<ColumnConfigBase>;
