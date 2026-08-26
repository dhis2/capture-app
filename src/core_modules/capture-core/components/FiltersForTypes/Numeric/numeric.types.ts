import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';
import { dataElementTypes } from '../../../metaData';

export type NumericFilterData = {
    ge?: number | null;
    le?: number | null;
};

export type NumericFilter = NumericFilterData | EmptyValueFilterData;

export type Value = {
    min?: string | null;
    max?: string | null;
} | string | null | undefined;

export type NumericFilterProps = {
    onCommitValue: (value: Value, isBlur?: boolean) => void;
    onUpdate: (commitValue?: Value) => void;
    value: Value;
    type: typeof dataElementTypes[keyof typeof dataElementTypes];
    disableEmptyValueFilter?: boolean;
};

export type NumericFilterManagerProps = {
    filter: NumericFilter | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: (value?: Value, isBlur?: boolean) => void;
    onUpdate: (commitValue?: Value) => void;
};
