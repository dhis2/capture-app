import type { DateTimeFilterData } from '../../../../../FiltersForTypes/DateTime';
import { escapeString } from '../../../../../../utils/escapeString';

/**
 * Converts DATE_TIME filter data to the API request format:
 * ge:{escapedIsoDateTime}:le:{escapedIsoDateTime}
 * Colons in the ISO datetime (e.g. 11:00:00.000Z) are escaped so the API
 * parser does not treat them as segment separators.
 * The data element id is prefixed by the caller, yielding: {id}:ge:...:le:...
 */
export function convertDateTime({
    sourceValue,
}: {
    sourceValue: DateTimeFilterData;
    meta: { key: string; storeId: string; isInit: boolean };
}): string {
    if (!sourceValue || sourceValue.type !== 'ABSOLUTE') {
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
