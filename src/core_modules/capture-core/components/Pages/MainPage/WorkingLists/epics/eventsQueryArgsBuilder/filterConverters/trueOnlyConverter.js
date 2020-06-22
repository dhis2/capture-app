// @flow

import type { TrueOnlyFilterData } from '../../../../../../FiltersForTypes/filters.types';

export function convertTrueOnly(filter: TrueOnlyFilterData) {
    return `eq:${filter.value}`;
}
