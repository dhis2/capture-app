import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type BooleanFilterData = {
    values: Array<boolean>,
};

export type BooleanValuesStringified = {
    values: Array<string>;
};

export type BooleanFilterStringified = BooleanValuesStringified | EmptyValueFilterData;

export type Value = Array<any> | string | boolean | null;

export type PlainProps = {
    value?: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (commitValue?: Value) => void;
    allowMultiple: boolean;
    disableEmptyValueFilter?: boolean;
};
