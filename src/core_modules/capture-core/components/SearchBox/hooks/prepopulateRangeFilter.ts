import { dataElementTypes } from '../../../metaData';
import type { CurrentSearchTerms } from '../SearchForm/SearchForm.types';

const RANGE_TYPES = [
    dataElementTypes.NUMBER_RANGE,
    dataElementTypes.INTEGER_RANGE,
    dataElementTypes.INTEGER_POSITIVE_RANGE,
    dataElementTypes.INTEGER_NEGATIVE_RANGE,
    dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE,
    dataElementTypes.DATE_RANGE,
    dataElementTypes.DATETIME_RANGE,
    dataElementTypes.TIME_RANGE,
];

export const isEqualRangeValue = (value: any, type: string): boolean => {
    if (!RANGE_TYPES.includes(type as any)) {
        return true;
    }

    if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
        return value.from === value.to;
    }

    return true;
};


export const filteredRangeForPrepopulation = (currentSearchTerms: CurrentSearchTerms | null): CurrentSearchTerms => {
    if (!currentSearchTerms) {
        return [];
    }

    return currentSearchTerms.filter(item => isEqualRangeValue(item.value, item.type));
};
