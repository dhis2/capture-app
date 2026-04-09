import { parseNumber } from 'capture-core-utils/parsers';
import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { NumericFilter, NumericFilterData, Value } from './numeric.types';

function parseOptionalNumber(s: string | null | undefined): number | undefined {
    if (s == null || s === '') return undefined;
    return parseNumber(s) ?? undefined;
}

export function getNumericFilterData(value: Value): NumericFilter | null {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    if (value == null || typeof value === 'string') {
        return null;
    }

    const data: NumericFilterData = {
        ge: parseOptionalNumber(value.min),
        le: parseOptionalNumber(value.max),
    };
    return data;
}
