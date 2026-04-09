import type { NumericFilterData } from '../../../../../FiltersForTypes/Numeric/numeric.types';

export function convertNumeric({ sourceValue }: { sourceValue: NumericFilterData }) {
    const requestData: string[] = [];

    if (sourceValue.ge || sourceValue.ge === 0) {
        requestData.push(`ge:${sourceValue.ge}`);
    }
    if (sourceValue.le || sourceValue.le === 0) {
        requestData.push(`le:${sourceValue.le}`);
    }

    return requestData.join(':');
}
