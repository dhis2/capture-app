import { parseNumber } from 'capture-core-utils/parsers';
import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { NumericFilter, Value } from './numeric.types';


export function getNumericFilterData(value: Value): NumericFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);

    const min = value.min || undefined;
    const max = value.max || undefined;

    return {
        ge: min ? parseNumber(min) : undefined,
        le: max ? parseNumber(max) : undefined,
    };
}
