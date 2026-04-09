import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type TextFilterData = {
    value: string,
};

export type TextFilter = TextFilterData | EmptyValueFilterData;
export type Value = string | null | undefined;

export type TextFilterProps = {
    onCommitValue: (value: Value, isBlur?: boolean) => void;
    onUpdate: (commitValue?: Value) => void;
    value: Value;
    searchOperator?: string;
    disableEmptyValueFilter?: boolean;
};
