import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type BooleanValueFilterData = {
    values: Array<boolean>;
};

export type BooleanFilterData = BooleanValueFilterData | EmptyValueFilterData;

export type Value = Array<boolean> | string | null;

export type PlainProps = {
    value?: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (commitValue?: Value) => void;
    allowMultiple: boolean;
    disableEmptyValueFilter?: boolean;
};
