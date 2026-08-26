import type { TrueOnlyFilterData } from '../../../../../ListView';

export function convertTrueOnly({ sourceValue }: { sourceValue: TrueOnlyFilterData }) {
    return `eq:${sourceValue.value}`;
}
