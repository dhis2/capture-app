// @flow
import { OptionSet } from '../../../../metaData';

export type WorkingListTemplate = {
    id: string,
    isDefault?: ?boolean,
    name: string,
    displayName: string,
    filters: Object,
    access: {
        read: boolean,
        update: boolean,
        delete: boolean,
        write: boolean,
        manage: boolean,
    },
    notPreserved?: ?boolean,
};

export type ColumnConfig = {
    id: string,
    visible: boolean,
    type: string,
    isMainProperty?: ?boolean,
    apiName?: ?string,
    header?: ?string,
    options?: ?Array<{text: string, value: any}>,
};

export type GetOrdinaryColumnMetadataFn = (id: string) => { header: string, optionSet: ?OptionSet };
export type GetMainColumnMetadataHeaderFn = (id: string) => string;
export type DataSource = { [id: string]: Object };
