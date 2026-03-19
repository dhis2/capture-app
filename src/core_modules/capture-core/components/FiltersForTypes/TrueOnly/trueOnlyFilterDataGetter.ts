import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TrueOnlyFilterData } from './types';

export function getTrueOnlyFilterData(value?: string): TrueOnlyFilterData {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    return {
        value: true,
    };
}
