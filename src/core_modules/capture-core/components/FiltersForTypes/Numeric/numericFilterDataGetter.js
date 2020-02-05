// @flow
import { parseNumber } from 'capture-core-utils/parsers';
import type { NumericFilterData } from '../filters.types';

type Value = {
    min?: ?string,
    max?: ?string,
}

export function getNumericFilterData(value: Value): NumericFilterData {
    const min = value.min || undefined;
    const max = value.max || undefined;

    return {
        ge: min && parseNumber(min),
        le: max && parseNumber(max),
    };
}
