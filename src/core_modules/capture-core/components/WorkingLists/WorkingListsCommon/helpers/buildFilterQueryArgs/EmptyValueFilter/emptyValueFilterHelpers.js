// @flow
import i18n from '@dhis2/d2-i18n';
import {
    EMPTY_FILTER_VALUE,
    NOT_EMPTY_FILTER_VALUE,
    API_FILTER_NULL,
    API_FILTER_NOT_NULL,
} from './constants';
import type { TextFilterData } from '../../../../../FiltersForTypes/Text/types';

const checkboxHandler = (flag: string) => (onCommit: (value: ?string) => void) => ({
    checked,
}: {| checked: boolean |}) => onCommit(checked ? flag : '');

const EMPTY_VALUE_RESULT_MAP: { [string]: TextFilterData } = {
    [EMPTY_FILTER_VALUE]: {
        value: i18n.t('Is empty'),
        isEmpty: true,
    },
    [NOT_EMPTY_FILTER_VALUE]: {
        value: i18n.t('Is not empty'),
        isNotEmpty: true,
    },
};

export const createEmptyValueCheckboxHandler = checkboxHandler(EMPTY_FILTER_VALUE);
export const createNotEmptyValueCheckboxHandler = checkboxHandler(NOT_EMPTY_FILTER_VALUE);

export const isEmptyValueFilter = (value: ?string): boolean =>
    value != null && Boolean(EMPTY_VALUE_RESULT_MAP[value]);

export const emptyValueFilterResults = (filter: any): ?TextFilterData => {
    if (typeof filter === 'string') {
        return EMPTY_VALUE_RESULT_MAP[filter] ?? null;
    }
    if (filter[API_FILTER_NULL]) {
        return EMPTY_VALUE_RESULT_MAP[EMPTY_FILTER_VALUE];
    }
    if (filter[API_FILTER_NOT_NULL]) {
        return EMPTY_VALUE_RESULT_MAP[NOT_EMPTY_FILTER_VALUE];
    }
    return undefined;
};
