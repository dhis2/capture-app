// @flow
export type AddTemplate = (name: string, criteria: Object, data: Object) => void;

export type UpdateTemplate = (template: Object, criteria: Object, data: Object) => void;

export type DeleteTemplate = (template: Object, programId: string) => void;
