// @flow
import type { TextFilterData } from '../../../eventList.types';

export function convertText(filter: TextFilterData) {
    return `like:${filter.value}`;
}
