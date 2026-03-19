import type { TimeFilterData } from './types/time.types';
import type { Value } from './Time.types';

export function getTimeFilterData(value: NonNullable<Value>): TimeFilterData | null {
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
