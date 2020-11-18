// @flow
import i18n from '@dhis2/d2-i18n';
import type { NumericFilterData } from '../../../../../FiltersForTypes';

// eslint-disable-next-line complexity
export function convertNumeric(filter: NumericFilterData) {
    let appliedText = '';
    const geHasValue = !!filter.ge || filter.ge === 0;
    const leHasValue = !!filter.le || filter.le === 0;

    if (geHasValue && leHasValue) {
        if (filter.ge === filter.le) {
            appliedText = filter.ge;
        } else {
            // $FlowFixMe[incompatible-use] automated comment
            appliedText = `${filter.ge.toString()} ${i18n.t('to')} ${filter.le.toString()}`;
        }
    } else if (geHasValue) {
        // $FlowFixMe[incompatible-use] automated comment
        appliedText = `${i18n.t('greater than or equal to')} ${filter.ge.toString()}`;
    } else {
        // $FlowFixMe[incompatible-use] automated comment
        appliedText = `${i18n.t('less than or equal to')} ${filter.le.toString()}`;
    }

    return appliedText;
}
