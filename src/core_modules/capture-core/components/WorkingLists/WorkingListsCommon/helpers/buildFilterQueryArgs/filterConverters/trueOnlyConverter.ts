import type { TrueOnlyFilterData } from '../../../../../FiltersForTypes';

export function convertTrueOnly({ sourceValue }: { sourceValue: TrueOnlyFilterData }) {
    return `eq:${sourceValue.value}`;
}
