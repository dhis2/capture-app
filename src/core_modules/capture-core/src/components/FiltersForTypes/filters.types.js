// @flow
export interface UpdatableFilterContent<T> {
    onGetUpdateData: (updatedValue?: T) => ?{ requestData: string | Array<string>, appliedText: string };
    onIsValid?: () => boolean,
}
