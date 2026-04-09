import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type NumericFilterData = {
    ge?: number | null,
    le?: number | null,
};

export type NumericFilter = NumericFilterData | EmptyValueFilterData;

export type Value = {
    min?: string | null;
    max?: string | null;
    isEmpty?: boolean;
    value?: string;
} | string | null | undefined;
