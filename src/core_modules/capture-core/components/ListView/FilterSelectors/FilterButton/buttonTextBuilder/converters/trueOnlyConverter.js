// @flow
import i18n from '@dhis2/d2-i18n';
import type { TrueOnlyFilterData } from '../../../../../FiltersForTypes';

export function convertTrueOnly(filter: TrueOnlyFilterData) {
    return i18n.t('Yes');
}
