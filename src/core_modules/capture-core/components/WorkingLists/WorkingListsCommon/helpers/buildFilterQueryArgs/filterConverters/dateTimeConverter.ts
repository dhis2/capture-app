import type { DateTimeFilterData } from '../../../../../FiltersForTypes/DateTime';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertDateTime({ sourceValue }: { sourceValue: DateTimeFilterData }): string {
    if (sourceValue?.type !== 'ABSOLUTE') {
        return '';
    }
    const requestData: string[] = [];
    if (sourceValue.ge) {
        requestData.push(`ge:${escapeString(sourceValue.ge)}`);
    }
    if (sourceValue.le) {
        requestData.push(`le:${escapeString(sourceValue.le)}`);
    }
    return requestData.join(':');
}
