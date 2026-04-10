import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TrueOnlyFilter } from './trueOnly.types';

export function getTrueOnlyFilterData(value?: string | null): TrueOnlyFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    return { value: true };
}
