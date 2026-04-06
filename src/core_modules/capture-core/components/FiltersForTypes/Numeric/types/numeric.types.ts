import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type NumericRangeFilterData = {
    ge?: number | null,
    le?: number | null,
};

export type NumericFilterData = NumericRangeFilterData | EmptyValueFilterData;
