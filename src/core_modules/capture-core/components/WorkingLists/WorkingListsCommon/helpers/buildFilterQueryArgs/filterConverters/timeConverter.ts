import type { TimeRangeFilterData } from '../../../../../FiltersForTypes/Time/time.types';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertTime({ sourceValue }: { sourceValue: TimeRangeFilterData }): string {
    const requestData: string[] = [];
    if (sourceValue.ge) {
        requestData.push(`ge:${escapeString(sourceValue.ge)}`);
    }
    if (sourceValue.le) {
        requestData.push(`le:${escapeString(sourceValue.le)}`);
    }
    return requestData.join(':');
}
