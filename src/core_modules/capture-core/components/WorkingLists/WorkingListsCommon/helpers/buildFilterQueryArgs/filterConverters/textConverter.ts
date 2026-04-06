import type { TextFilterData } from '../../../../../ListView';
import { escapeString } from '../../../../../../utils/escapeString';
import type { SearchOperator } from '../../../../../../metaDataMemoryStoreBuilders';

export function convertText(
    { sourceValue, searchOperator }: { sourceValue: TextFilterData; searchOperator?: SearchOperator },
): string {
    if ('isEmpty' in sourceValue) {
        return '';
    }
    const operator = searchOperator ? searchOperator.toLowerCase() : 'like';
    return `${operator}:${escapeString(sourceValue.value)}`;
}
