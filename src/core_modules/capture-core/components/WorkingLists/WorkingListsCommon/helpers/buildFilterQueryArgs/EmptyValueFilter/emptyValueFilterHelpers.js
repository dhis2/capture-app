// @flow
import i18n from '@dhis2/d2-i18n';
import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    API_EMPTY_VALUE_FILTER,
    API_NOT_EMPTY_VALUE_FILTER,
} from './constants';
import type { TextFilterData } from '../../../../../FiltersForTypes/Text/types';

const checkboxHandler = (flag: string) => (onCommit: (value: ?string) => void) => ({
    checked,
}: {| checked: boolean |}) => onCommit(checked ? flag : '');

const FILTER_EMPTY_VALUE_MAP: { [string]: TextFilterData } = {
    [EMPTY_VALUE_FILTER]: {
        value: i18n.t('Is empty'),
        isEmpty: true,
    },
    [NOT_EMPTY_VALUE_FILTER]: {
        value: i18n.t('Is not empty'),
        isNotEmpty: true,
    },
};

export const createEmptyValueCheckboxHandler = checkboxHandler(EMPTY_VALUE_FILTER);
export const createNotEmptyValueCheckboxHandler = checkboxHandler(NOT_EMPTY_VALUE_FILTER);

export const isEmptyValueFilter = (value: ?string): boolean =>
    value != null && Boolean(FILTER_EMPTY_VALUE_MAP[value]);

export const emptyValueFilterResults = (filter: any): ?TextFilterData => {
    if (typeof filter === 'string') {
        return FILTER_EMPTY_VALUE_MAP[filter] ?? null;
    }
    if (filter[API_EMPTY_VALUE_FILTER]) {
        return FILTER_EMPTY_VALUE_MAP[EMPTY_VALUE_FILTER];
    }
    if (filter[API_NOT_EMPTY_VALUE_FILTER]) {
        return FILTER_EMPTY_VALUE_MAP[NOT_EMPTY_VALUE_FILTER];
    }
    return undefined;
};
