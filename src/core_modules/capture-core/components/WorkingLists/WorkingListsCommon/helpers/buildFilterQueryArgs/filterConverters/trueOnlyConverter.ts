import type { TrueOnlyFilterData } from '../../../../../FiltersForTypes/TrueOnly/trueOnly.types';

export function convertTrueOnly({ sourceValue }: { sourceValue: TrueOnlyFilterData }) {
    return `eq:${sourceValue.value}`;
}
