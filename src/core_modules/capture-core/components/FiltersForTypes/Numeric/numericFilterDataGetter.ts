import { parseNumber } from 'capture-core-utils/parsers';
import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';
import type { NumericFilterData } from './types';

type Value = {
    min?: string | null,
    max?: string | null,
    isEmpty?: boolean,
    value?: string,
} | string | null | undefined;

function parseOptionalNumber(s: string | null | undefined): number | undefined {
    if (s == null) return undefined;
    return parseNumber(s) ?? undefined;
}

export function getNumericFilterData(value: Value): NumericFilterData | null {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return value === EMPTY_VALUE_FILTER
            ? { value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
            : { value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
    }

    if (value == null || typeof value === 'string') {
        return null;
    }

    return {
        ge: parseOptionalNumber(value.min),
        le: parseOptionalNumber(value.max),
    };
}
