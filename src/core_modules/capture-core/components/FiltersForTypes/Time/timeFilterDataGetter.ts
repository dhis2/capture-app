import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TimeFilter, TimeFilterData, Value } from './time.types';

export function getTimeFilterData(value: Value): TimeFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
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
