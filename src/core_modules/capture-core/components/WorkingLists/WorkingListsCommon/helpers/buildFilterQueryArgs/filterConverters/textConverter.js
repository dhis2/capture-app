// @flow
import type { TextFilterData } from '../../../../../ListView';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertText({ sourceValue, unique }: { sourceValue: TextFilterData, unique?: boolean }): string {
    return unique ? `eq:${escapeString(sourceValue.value)}` : `like:${escapeString(sourceValue.value)}`;
}
