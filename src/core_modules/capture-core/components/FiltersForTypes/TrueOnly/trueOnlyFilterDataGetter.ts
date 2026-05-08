import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TrueOnlyFilter, Value } from './trueOnly.types';

export function getTrueOnlyFilterData(value: Value): TrueOnlyFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    return { value: true };
}
