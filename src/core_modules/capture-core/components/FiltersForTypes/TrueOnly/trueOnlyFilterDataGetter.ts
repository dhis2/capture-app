import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TrueOnlyFilter, TrueOnlyFilterData } from './trueOnly.types';

export function getTrueOnlyFilterData(value?: string): TrueOnlyFilter {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    const data: TrueOnlyFilterData = { value: true };
    return data;
}
