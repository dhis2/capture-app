import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type TrueOnlyFilterData = {
    value: boolean;
};

export type TrueOnlyFilter = TrueOnlyFilterData | EmptyValueFilterData;

export type Value = Array<string> | string | null | undefined;

export type TrueOnlyFilterProps = {
    value: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (value?: Value) => void;
    disableEmptyValueFilter?: boolean;
};

export type TrueOnlyFilterManagerProps = {
    filter: TrueOnlyFilter | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
};
