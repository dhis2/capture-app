import type { TrueOnlyValueFilterData } from '../../../../../FiltersForTypes/TrueOnly/trueOnly.types';

export function convertTrueOnly({ sourceValue }: { sourceValue: TrueOnlyValueFilterData }) {
    return `eq:${sourceValue.value}`;
}
