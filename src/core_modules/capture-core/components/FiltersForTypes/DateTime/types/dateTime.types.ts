import type { EmptyValueFilterData } from '../../EmptyValue/types';
import { dateFilterTypes } from '../../Date/constants';

export type DateTimeAbsoluteFilterData = {
    type: typeof dateFilterTypes.ABSOLUTE;
    ge?: string;
    le?: string;
};

export type DateTimeFilterData = DateTimeAbsoluteFilterData | EmptyValueFilterData;

export type DateTimeValue = {
    date?: string | null;
    time?: string | null;
    error?: string | null;
    isValid?: boolean | null;
};
