import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type DateTimeFilterData = {
    type: 'ABSOLUTE';
    ge?: string;
    le?: string;
};

export type DateTimeFilter = DateTimeFilterData | EmptyValueFilterData;

export type DateTimeValue = {
    date?: string | null;
    time?: string | null;
    error?: string | null;
    isValid?: boolean | null;
};
export type Value = {
    from?: DateTimeValue | null;
    to?: DateTimeValue | null;
} | string | null;
