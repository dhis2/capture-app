import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type TextValueFilterData = {
    value: string,
};

export type TextFilterData = TextValueFilterData | EmptyValueFilterData;
export type Value = string | null | undefined;

export type TextFilterProps = {
    onCommitValue: (value: Value, isBlur?: boolean) => void;
    onUpdate: (commitValue?: Value) => void;
    value: Value;
    searchOperator?: string;
    disableEmptyValueFilter?: boolean;
};
