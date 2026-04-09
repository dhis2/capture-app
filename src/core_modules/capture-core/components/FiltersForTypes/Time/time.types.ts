import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type TimeFilterData = {
    ge?: string;
    le?: string;
};

export type TimeFilter = TimeFilterData | EmptyValueFilterData;
export type Value = {
    from?: string | null;
    to?: string | null;
} | string | null;
