// @flow
import i18n from '@dhis2/d2-i18n';
import { EMPTY_FILTER_VALUE, NOT_EMPTY_FILTER_VALUE } from './constants';
import type { TextFilterData } from './types';

export function getTextFilterData(value: ?string): ?TextFilterData {
    if (value === EMPTY_FILTER_VALUE) {
        return {
            value: i18n.t('Is empty'),
            isNoValue: true,
        };
    }

    if (value === NOT_EMPTY_FILTER_VALUE) {
        return {
            value: i18n.t('Is not empty'),
            isNotEmpty: true,
        };
    }

    return value ? { value } : null;
}
