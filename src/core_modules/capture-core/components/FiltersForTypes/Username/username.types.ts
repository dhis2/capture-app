import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type UsernameValueFilterData = {
    value: string;
};

export type UsernameFilterData = UsernameValueFilterData | EmptyValueFilterData;
export type Value = string | null | undefined;

export type UsernameFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    value: Value;
    disableEmptyValueFilter?: boolean;
};
