import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type TimeFilterData = {
    ge?: string;
    le?: string;
};

export type TimeFilter = TimeFilterData | EmptyValueFilterData;

export type Value = {
    from?: string | null;
    to?: string | null;
} | string | null | undefined;

export type TimeFilterProps = {
    onCommitValue: (value: Value) => void;
    value: Value;
    onUpdate: (commitValue?: Value) => void;
    disableEmptyValueFilter?: boolean;
};

export type TimeFilterManagerProps = {
    filter: TimeFilter | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: (value?: Value) => void;
};
