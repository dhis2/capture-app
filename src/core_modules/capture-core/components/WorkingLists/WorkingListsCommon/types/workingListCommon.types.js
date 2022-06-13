// @flow
import type { FiltersData } from '../../WorkingListsBase';

export type Callbacks = { callBacks?: { onChangeTemplate?: (selectedTemplateId?: string) => void };}

export type RecordsOrder = Array<string>;

export type CustomColumnOrder = Array<{ id: string, visible: string }>;

export type AddTemplate = (name: string, criteria: Object, data: Object, callBacks?: Callbacks) => void;

export type UpdateTemplate = (template: Object, criteria: Object, data: Object) => void;

export type DeleteTemplate = (
    template: Object,
    programId: string,
    callBacks?: Callbacks,
) => void;

export type UpdateList = (queryArgs: Object, columnsMetaForDataFetching: Object, lastTransaction: number) => void;

export type InitialViewConfig = {|
    filters?: FiltersData,
    customVisibleColumnIds?: Array<string>,
    sortById?: string,
    sortByDirection?: string,
|};
