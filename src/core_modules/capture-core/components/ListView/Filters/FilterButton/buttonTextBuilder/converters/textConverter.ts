import type { TextFilterData } from '../../../../../FiltersForTypes';

export function convertText(filter: TextFilterData): string {
    return filter.value;
}
