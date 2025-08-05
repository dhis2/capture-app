// @flow
import i18n from '@dhis2/d2-i18n';
import { EMPTY_FILTER_VALUE, NOT_EMPTY_FILTER_VALUE } from './constants';
import type { TextFilterData } from '../../../FiltersForTypes/Text/types';

export const emptyValueFilterResults = (value: ?string): ?TextFilterData => {
    if (value === EMPTY_FILTER_VALUE) {
        return {
            value: i18n.t('Is empty'),
            isEmpty: true,
        };
    }

    if (value === NOT_EMPTY_FILTER_VALUE) {
        return {
            value: i18n.t('Is not empty'),
            isNotEmpty: true,
        };
    }

    return null;
};

export const getEmptyValueResult = (): TextFilterData => ({
    value: i18n.t('Is empty'),
    isEmpty: true,
});

export const getNotEmptyValueResult = (): TextFilterData => ({
    value: i18n.t('Is not empty'),
    isNotEmpty: true,
});
