// @flow
import i18n from '@dhis2/d2-i18n';
import {
    EMPTY_FILTER_VALUE,
    NOT_EMPTY_FILTER_VALUE,
    API_FILTER_NULL,
    API_FILTER_NOT_NULL,
} from './constants';
import type { TextFilterData } from '../../../../../FiltersForTypes/Text/types';

export type EmptyValueFilterChangeHandler = (value: ?string) => void;

export const createEmptyValueCheckboxHandler = (onCommitValue: EmptyValueFilterChangeHandler) =>
    ({ checked }: {| checked: boolean |}) => {
        onCommitValue(checked ? EMPTY_FILTER_VALUE : '');
    };

export const createNotEmptyValueCheckboxHandler = (onCommitValue: EmptyValueFilterChangeHandler) =>
    ({ checked }: {| checked: boolean |}) => {
        onCommitValue(checked ? NOT_EMPTY_FILTER_VALUE : '');
    };

export const isEmptyValueFilter = (value: ?string): boolean =>
    value === EMPTY_FILTER_VALUE || value === NOT_EMPTY_FILTER_VALUE;

export const shouldShowMainInputForEmptyValueFilter = (value: ?string): boolean =>
    Boolean(value && !isEmptyValueFilter(value));


const RESULT_MAP: { [key: string]: TextFilterData } = {
    [EMPTY_FILTER_VALUE]: {
        value: i18n.t('Is empty'),
        isEmpty: true,
    },
    [NOT_EMPTY_FILTER_VALUE]: {
        value: i18n.t('Is not empty'),
        isNotEmpty: true,
    },
};

export const emptyValueFilterResults = (filter: any): ?TextFilterData => {
    if (!filter) {
        return null;
    }

    if (typeof filter === 'string') {
        return RESULT_MAP[filter] || null;
    }

    if (filter[API_FILTER_NULL]) {
        return RESULT_MAP[EMPTY_FILTER_VALUE];
    }
    if (filter[API_FILTER_NOT_NULL]) {
        return RESULT_MAP[NOT_EMPTY_FILTER_VALUE];
    }

    return null;
};
