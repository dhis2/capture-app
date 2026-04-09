import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TextFilterData, Value } from './text.types';

export const getTextFilterData = (value: Value): TextFilterData | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    return value ? { value } : null;
};
