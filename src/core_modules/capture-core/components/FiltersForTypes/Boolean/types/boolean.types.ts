import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type BooleanValueFilterData = {
    values: Array<string>;
};

export type BooleanFilterData = BooleanValueFilterData | EmptyValueFilterData;

export type Value = Array<any> | string | boolean | null;

export type PlainProps = {
    value?: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (commitValue?: Value) => void;
    allowMultiple: boolean;
    disableEmptyValueFilter?: boolean;
};
