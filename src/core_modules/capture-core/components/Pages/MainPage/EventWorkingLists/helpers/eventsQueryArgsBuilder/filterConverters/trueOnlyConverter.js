// @flow
import type { TrueOnlyFilterData } from '../../../../../../ListView';

export function convertTrueOnly(filter: TrueOnlyFilterData) {
  // $FlowFixMe[incompatible-type] automated comment
  return `eq:${filter.value}`;
}
