// @flow
export interface UpdatableFilterContent<T> {
  onGetUpdateData: (updatedValue?: T) => any;
  onIsValid?: () => boolean;
}
