export type UpdatableFilterContent<T> = {
    onGetUpdateData: (updatedValue?: T) => any;
    onIsValid?: () => boolean;
    showValidationErrors?: () => void;
};
