// @flow
import type { TextFilterData } from '../../../../../ListView';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertText(filter: TextFilterData) {
    return `like:${escapeString(filter.value)}`;
}
