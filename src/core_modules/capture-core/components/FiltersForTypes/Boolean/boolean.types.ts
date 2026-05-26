import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type BooleanFilterData = {
    values: Array<boolean>;
};

export type BooleanFilter = BooleanFilterData | EmptyValueFilterData;

export type Value = Array<boolean> | boolean | string | null | undefined;

export type BooleanFilterProps = {
    value: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (commitValue?: Value) => void;
    allowMultiple: boolean;
    disableEmptyValueFilter?: boolean;
};

export type BooleanFilterManagerProps = {
    filter: BooleanFilter | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
    singleSelect: boolean;
};
