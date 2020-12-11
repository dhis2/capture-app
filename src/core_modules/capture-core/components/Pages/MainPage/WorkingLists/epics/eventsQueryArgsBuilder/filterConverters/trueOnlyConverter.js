// @flow

import type { TrueOnlyFilterData } from '../../../../../../FiltersForTypes/filters.types';

export function convertTrueOnly(filter: TrueOnlyFilterData) {
  // $FlowFixMe[incompatible-type] automated comment
  return `eq:${filter.value}`;
}
