import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type TimeRangeFilterData = {
    ge?: string;
    le?: string;
};

export type TimeFilterData = TimeRangeFilterData | EmptyValueFilterData;
export type Value = {
    from?: string | null;
    to?: string | null;
} | string | null;
