import type { TimeFilterData } from '../../../../../FiltersForTypes/Time';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertTime({
    sourceValue,
}: {
    sourceValue: TimeFilterData;
    meta: { key: string; storeId: string; isInit: boolean };
}): string {
    if (!sourceValue) {
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
