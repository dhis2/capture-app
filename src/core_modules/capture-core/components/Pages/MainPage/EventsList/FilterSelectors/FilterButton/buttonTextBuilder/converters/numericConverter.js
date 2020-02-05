// @flow
import i18n from '@dhis2/d2-i18n';
import type { NumericFilterData } from '../../../../eventList.types';

// eslint-disable-next-line complexity
export function convertNumeric(filter: NumericFilterData) {
    let appliedText = '';
    const geHasValue = !!filter.ge || filter.ge === 0;
    const leHasValue = !!filter.le || filter.le === 0;

    if (geHasValue && leHasValue) {
        if (filter.ge === filter.le) {
            appliedText = filter.ge;
        } else {
            // $FlowSuppress
            appliedText = `${filter.ge.toString()} ${i18n.t('to')} ${filter.le.toString()}`;
        }
    } else if (geHasValue) {
        // $FlowSuppress
        appliedText = `${i18n.t('greater than or equal to')} ${filter.ge.toString()}`;
    } else {
        // $FlowSuppress
        appliedText = `${i18n.t('less than or equal to')} ${filter.le.toString()}`;
    }

    return appliedText;
}
