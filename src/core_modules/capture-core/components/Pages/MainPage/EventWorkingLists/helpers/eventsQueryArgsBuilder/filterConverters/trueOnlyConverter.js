// @flow
import type { TrueOnlyFilterData } from '../../../../../../ListView';

export function convertTrueOnly(filter: TrueOnlyFilterData) {
    return `eq:${filter.value}`;
}
