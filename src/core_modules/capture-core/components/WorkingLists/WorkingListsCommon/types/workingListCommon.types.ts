import type { FiltersData, Categories } from '../../WorkingListsBase';

export type Callbacks = { callBacks?: { onChangeTemplate?: (selectedTemplateId?: string) => void };}

export type RecordsOrder = Array<string>;

export type CustomColumnOrder = Array<{ id: string, visible: string }>;

export type AddTemplate = (name: string, criteria: any, data: any, callBacks?: Callbacks) => void;

export type UpdateTemplate = (template: any, criteria: any, data: any) => void;

export type UpdateDefaultTemplate = (template: any) => void;

export type DeleteTemplate = (
    template: any,
    programId: string,
    programStageId?: string,
    callBacks?: Callbacks,
) => void;

export type UpdateList = (queryArgs: any, columnsMetaForDataFetching: any, lastTransaction: number) => void;

export type LoadView = (
    template: any,
    context: {
        programId: string,
        orgUnitId: string,
        categories?: Categories,
        programStageId?: string,
        currentRequest?: string,
    },
    meta: {
        columnsMetaForDataFetching: any,
        filtersOnlyMetaForDataFetching: any,
    },
) => Promise<void> | void;

export type InitialViewConfig = {
    filters?: FiltersData,
    customVisibleColumnIds?: Array<string>,
    sortById?: string,
    sortByDirection?: string,
};
