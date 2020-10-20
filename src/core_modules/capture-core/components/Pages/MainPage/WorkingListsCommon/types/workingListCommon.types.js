// @flow
export type AddTemplate = (name: string, criteria: Object, data: Object) => void;

export type UpdateTemplate = (template: Object, criteria: Object, data: Object) => void;

export type DeleteTemplate = (template: Object, programId: string) => void;

export type UpdateList = (queryArgs: Object, lastTransaction: number, columnsMetaForDataFetching: Object) => void;
