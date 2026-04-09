import type { TextFilterData } from '../../../../../FiltersForTypes/Text/text.types';

export function convertText(filter: TextFilterData): string {
    return filter.value;
}
