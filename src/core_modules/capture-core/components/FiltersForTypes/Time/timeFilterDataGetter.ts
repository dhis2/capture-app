import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TimeFilter, TimeFilterData, Value } from './time.types';

export function getTimeFilterData(value: NonNullable<Value>): TimeFilter | null {
    if (typeof value === 'string') {
        return isEmptyValueFilter(value) ? getEmptyValueFilterData(value) : null;
    }

    const filterData: TimeFilterData = {};

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
