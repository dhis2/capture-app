// @flow
export type RecordsOrder = Array<string>;

export type CustomColumnOrder = Array<{ id: string, visible: string }>;

export type AddTemplate = (name: string, criteria: Object, data: Object) => void;

export type UpdateTemplate = (template: Object, criteria: Object, data: Object) => void;

export type DeleteTemplate = (template: Object, programId: string) => void;

export type UpdateList = (queryArgs: Object, columnsMetaForDataFetching: Object, lastTransaction: number) => void;
