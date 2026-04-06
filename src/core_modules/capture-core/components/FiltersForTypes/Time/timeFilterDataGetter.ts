import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TimeFilterData, TimeRangeFilterData } from './types/time.types';
import type { Value } from './types';

export function getTimeFilterData(value: NonNullable<Value>): TimeFilterData | null {
    if (typeof value === 'string') {
        return isEmptyValueFilter(value) ? getEmptyValueFilterData(value) : null;
    }

    const filterData: TimeRangeFilterData = {};

    if (value.from) {
        filterData.ge = value.from;
    }

    if (value.to) {
        filterData.le = value.to;
    }

    if (!filterData.ge && !filterData.le) {
        return null;
    }

    return filterData;
}
