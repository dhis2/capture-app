import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TimeFilter, TimeFilterData, Value } from './time.types';

export function getTimeFilterData(value: NonNullable<Value>): TimeFilter | null {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    if (typeof value === 'string') {
        return null;
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
