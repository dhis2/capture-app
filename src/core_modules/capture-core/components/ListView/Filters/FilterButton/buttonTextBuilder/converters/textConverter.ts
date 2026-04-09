import type { TextFilter } from '../../../../../FiltersForTypes/Text/text.types';
import { isEmptyFilterData } from '../../../../../FiltersForTypes/EmptyValue';

export function convertText(filter: TextFilter): string {
    if (isEmptyFilterData(filter)) {
        return String(filter.value);
    }
    return filter.value;
}
