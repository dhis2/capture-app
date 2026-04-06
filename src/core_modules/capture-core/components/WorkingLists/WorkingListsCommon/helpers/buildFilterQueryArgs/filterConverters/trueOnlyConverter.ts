import type { TrueOnlyFilterData } from '../../../../../ListView';

export function convertTrueOnly({ sourceValue }: { sourceValue: TrueOnlyFilterData }) {
    if ('isEmpty' in sourceValue) {
        return '';
    }
    return `eq:${sourceValue.value}`;
}
