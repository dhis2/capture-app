// @flow
import i18n from '@dhis2/d2-i18n';
import type { TextFilterData } from '../index';

export const API_FILTER_NULL: 'null' = 'null';
export const API_FILTER_NOT_NULL: '!null' = '!null';

export const getEmptyOrNotEmptyTextFilterData = (
    filter: any,
): ?TextFilterData => {
    if (filter?.[API_FILTER_NULL]) {
        return { value: i18n.t('Is empty'), isEmpty: true };
    }

    if (filter?.[API_FILTER_NOT_NULL]) {
        return { value: i18n.t('Is not empty'), isNotEmpty: true };
    }

    return undefined;
};
