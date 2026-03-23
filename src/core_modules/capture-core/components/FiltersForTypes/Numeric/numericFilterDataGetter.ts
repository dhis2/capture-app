import { parseNumber } from 'capture-core-utils/parsers';
import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { NumericFilterData } from './types';

type Value = {
    min?: string | null,
    max?: string | null,
    isEmpty?: boolean,
    value?: string,
} | string | null | undefined;

function parseOptionalNumber(s: string | null | undefined): number | undefined {
    if (s == null || s === '') return undefined;
    return parseNumber(s) ?? undefined;
}

export function getNumericFilterData(value: Value): NumericFilterData | null {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    if (value == null || typeof value === 'string') {
        return null;
    }

    return {
        ge: parseOptionalNumber(value.min),
        le: parseOptionalNumber(value.max),
    };
}
