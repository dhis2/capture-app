import i18n from '@dhis2/d2-i18n';
import type { NumericFilterData } from '../../../../../FiltersForTypes';

export function convertNumeric(filter: NumericFilterData): string {
    let appliedText = '';
    const geHasValue = !!filter.ge || filter.ge === 0;
    const leHasValue = !!filter.le || filter.le === 0;

    if (geHasValue && leHasValue) {
        if (filter.ge === filter.le) {
            appliedText = filter.ge!.toString();
        } else {
            appliedText = i18n.t('{{from}} to {{to}}', {
                from: filter.ge,
                to: filter.le,
            });
        }
    } else if (geHasValue) {
        appliedText = i18n.t('greater than or equal to {{value}}', {
            value: filter.ge,
        });
    } else {
        appliedText = i18n.t('less than or equal to {{value}}', {
            value: filter.le,
        });
    }

    return appliedText;
}
