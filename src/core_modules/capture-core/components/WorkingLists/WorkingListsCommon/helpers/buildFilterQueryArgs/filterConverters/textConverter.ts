import type { TextValueFilterData } from '../../../../../FiltersForTypes/Text/text.types';
import { escapeString } from '../../../../../../utils/escapeString';
import type { SearchOperator } from '../../../../../../metaDataMemoryStoreBuilders';

export function convertText(
    { sourceValue, searchOperator }: { sourceValue: TextValueFilterData; searchOperator?: SearchOperator },
): string {
    const operator = searchOperator ? searchOperator.toLowerCase() : 'like';
    return `${operator}:${escapeString(sourceValue.value)}`;
}
