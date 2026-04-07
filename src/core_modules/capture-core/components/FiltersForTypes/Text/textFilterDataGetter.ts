import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { TextFilterData } from './types';

export const getTextFilterData = (value: string | null | undefined): TextFilterData | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    return value ? { value } : null;
};
