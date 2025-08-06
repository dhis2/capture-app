// @flow
import i18n from '@dhis2/d2-i18n';

export const EMPTY_VALUE_FILTER = 'EMPTY_VALUE_FILTER';
export const NOT_EMPTY_VALUE_FILTER = 'NOT_EMPTY_VALUE_FILTER';

export const API_EMPTY_VALUE_FILTER = 'null';
export const API_NOT_EMPTY_VALUE_FILTER = '!null';

export type NullValueFilterData = {|
    isEmpty?: boolean,
    isNotEmpty?: boolean,
|};

export const isEmptyValueFilter = (value: ?string) =>
    value === EMPTY_VALUE_FILTER || value === NOT_EMPTY_VALUE_FILTER;

export const getLabelForEmptyValueFilter = (filterData: NullValueFilterData) => {
    if (filterData.isEmpty) {
        return i18n.t('Is empty');
    }
    if (filterData.isNotEmpty) {
        return i18n.t('Is not empty');
    }
    return undefined;
};

export const makeCheckboxHandler =
    (flag: string) =>
        (onCommit: (?string) => void) =>
            ({ checked }: {| checked: boolean |}) =>
                onCommit(checked ? flag : '');

export const fromApiEmptyValueFilter = (filter: Object): ?NullValueFilterData => {
    if (filter?.[API_EMPTY_VALUE_FILTER]) {
        return { isEmpty: true };
    }
    if (filter?.[API_NOT_EMPTY_VALUE_FILTER]) {
        return { isNotEmpty: true };
    }
    return undefined;
};

export const toApiEmptyValueFilter = (data: NullValueFilterData) => {
    if (data.isEmpty) {
        return { [API_EMPTY_VALUE_FILTER]: true };
    }
    if (data.isNotEmpty) {
        return { [API_NOT_EMPTY_VALUE_FILTER]: true };
    }
    throw new Error('nullValueFilter: invalid data');
};
