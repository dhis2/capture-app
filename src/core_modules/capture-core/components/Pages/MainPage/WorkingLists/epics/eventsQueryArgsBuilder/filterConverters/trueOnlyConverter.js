// @flow
import type { TrueOnlyFilterData } from '../../../eventList.types';

export function convertTrueOnly(filter: TrueOnlyFilterData) {
    return `eq:${filter.value}`;
}
