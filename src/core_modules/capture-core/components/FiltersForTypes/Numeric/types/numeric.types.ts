import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type NumericRangeFilterData = {
    ge?: number | null,
    le?: number | null,
};

export type NumericFilterData = NumericRangeFilterData | EmptyValueFilterData;
export type Value = {
    min?: string | null;
    max?: string | null;
    isEmpty?: boolean;
    value?: string;
} | string | null | undefined;
