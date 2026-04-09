import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type BooleanFilterData = {
    values: Array<boolean>;
};

export type BooleanFilter = BooleanFilterData | EmptyValueFilterData;

export type Value = Array<boolean> | boolean | string | null;

export type PlainProps = {
    value?: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (commitValue?: Value) => void;
    allowMultiple: boolean;
    disableEmptyValueFilter?: boolean;
};
