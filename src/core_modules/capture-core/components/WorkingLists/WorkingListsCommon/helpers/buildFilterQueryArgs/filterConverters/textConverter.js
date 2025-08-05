// @flow
import type { TextFilterData } from '../../../../../ListView';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertText({ sourceValue, unique }: { sourceValue: TextFilterData, unique?: boolean }): string {
    const operator = unique ? 'eq' : 'like';
    return `${operator}:${escapeString(sourceValue.value)}`;
}
