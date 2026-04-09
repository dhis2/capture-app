import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type UsernameFilterData = {
    value: string;
};

export type UsernameFilter = UsernameFilterData | EmptyValueFilterData;

export type Value = string | null | undefined;

export type UsernameFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    value: Value;
    disableEmptyValueFilter?: boolean;
};
