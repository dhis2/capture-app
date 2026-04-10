import { parseNumber } from 'capture-core-utils/parsers';
import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { NumericFilter, Value } from './numeric.types';

function parseOptionalNumber(s: string | null | undefined): number | undefined {
    if (s == null || s === '') return undefined;
    return parseNumber(s) ?? undefined;
}

export function getNumericFilterData(value: Value): NumericFilter | null {
    if (!value) return null;
    if (typeof value === 'string') {
        return isEmptyValueFilter(value) ? getEmptyValueFilterData(value) : null;
    }
    const ge = parseOptionalNumber(value.min);
    const le = parseOptionalNumber(value.max);
    if (ge == null && le == null) return null;
    return { ge, le };
}
