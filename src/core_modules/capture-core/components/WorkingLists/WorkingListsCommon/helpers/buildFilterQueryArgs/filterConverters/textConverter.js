// @flow
import { escapeString } from '../../../../../../utils/escapeString';
import type { TextFilterData } from '../../../../../FiltersForTypes/Text/types';

export function convertText({ sourceValue, unique }: { sourceValue: TextFilterData, unique?: boolean }): string {
    if (sourceValue.isEmpty) {
        return 'null';
    }

    if (sourceValue.isNotEmpty) {
        return '!null';
    }

    const operator = unique ? 'eq' : 'like';
    return `${operator}:${escapeString(sourceValue.value)}`;
}
