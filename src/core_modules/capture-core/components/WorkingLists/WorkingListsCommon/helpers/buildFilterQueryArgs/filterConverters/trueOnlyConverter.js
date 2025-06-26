// @flow
import type { TrueOnlyFilterData } from '../../../../../ListView';

export function convertTrueOnly({ sourceValue }: { sourceValue: TrueOnlyFilterData }) {
    // $FlowFixMe[incompatible-type] automated comment
    return `eq:${sourceValue.value}`;
}
