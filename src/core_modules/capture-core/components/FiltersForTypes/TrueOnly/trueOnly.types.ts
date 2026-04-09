import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type TrueOnlyFilterData = {
    value: boolean;
};

export type TrueOnlyFilter = TrueOnlyFilterData | EmptyValueFilterData;

export type Value = Array<any> | string | null | undefined;

export type PlainProps = {
    value: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (value?: Value) => void;
    disableEmptyValueFilter?: boolean;
};
