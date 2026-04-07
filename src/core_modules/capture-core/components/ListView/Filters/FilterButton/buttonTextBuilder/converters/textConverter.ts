import type { TextFilterData } from '../../../../../FiltersForTypes';

export function convertText(filter: TextFilterData): string {
    if ('isEmpty' in filter) {
        return String(filter.value);
    }
    return filter.value;
}
