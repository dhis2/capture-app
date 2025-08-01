// @flow
import { escapeString } from '../../../../../../utils/escapeString';
import type { TextFilterData } from '../../../../../FiltersForTypes/Text/types';

export function convertText({ sourceValue, unique }: { sourceValue: TextFilterData, unique?: boolean }): string {
    if (sourceValue.isNoValue) {
        return 'null';
    }

    const operator = unique ? 'eq' : 'like';
    return `${operator}:${escapeString(sourceValue.value)}`;
}
