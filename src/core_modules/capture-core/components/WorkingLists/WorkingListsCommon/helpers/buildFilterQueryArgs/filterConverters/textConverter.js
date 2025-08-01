// @flow
import type { TextFilterData } from '../../../../../ListView';
import { escapeString } from '../../../../../../utils/escapeString';
import { isNoValueFilter, convertNoValueFilter } from '../../../../../FiltersForTypes/common/constants';

export function convertText({ sourceValue, unique }: { sourceValue: TextFilterData, unique?: boolean }): string {
    if (isNoValueFilter(sourceValue.value)) {
        return convertNoValueFilter(sourceValue.value);
    }

    if (sourceValue.value) {
        const operator = unique ? 'eq' : 'like';
        return `${operator}:${escapeString(sourceValue.value)}`;
    }

    return '';
}
