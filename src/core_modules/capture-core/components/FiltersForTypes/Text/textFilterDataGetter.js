// @flow
import i18n from '@dhis2/d2-i18n';
import type { TextFilterData } from './types';

export function getTextFilterData(value: ?string): ?TextFilterData {
    if (value === null) {
        return {
            value: i18n.t('Is empty'),
            isNoValue: true,
        };
    }

    return value ? { value } : null;
}
