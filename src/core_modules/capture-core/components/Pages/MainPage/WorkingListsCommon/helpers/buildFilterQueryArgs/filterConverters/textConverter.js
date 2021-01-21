// @flow
import type { TextFilterData } from '../../../../../../ListView';

export function convertText(filter: TextFilterData) {
    return `like:${filter.value}`;
}
