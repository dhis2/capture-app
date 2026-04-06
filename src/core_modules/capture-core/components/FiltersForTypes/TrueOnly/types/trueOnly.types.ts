import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type TrueOnlyValueFilterData = {
    value: boolean;
};

export type TrueOnlyFilterData = TrueOnlyValueFilterData | EmptyValueFilterData;
export type Value = Array<any> | string | null | undefined;

export type PlainProps = {
    value: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (value?: Value) => void;
    disableEmptyValueFilter?: boolean;
};
