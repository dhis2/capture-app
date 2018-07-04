// @flow
export interface UpdatableFilterContent {
    onGetUpdateData: (commitValue?: any) => ?{ requestData: any, appliedText: string };
    onIsValid?: () => boolean,
}
