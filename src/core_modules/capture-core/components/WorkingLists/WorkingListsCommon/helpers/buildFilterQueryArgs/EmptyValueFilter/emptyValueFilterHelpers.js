// @flow
import i18n from '@dhis2/d2-i18n';

export const EMPTY_VALUE_FILTER = 'EMPTY_VALUE_FILTER';
export const NOT_EMPTY_VALUE_FILTER = 'NOT_EMPTY_VALUE_FILTER';

export const API_EMPTY_VALUE_FILTER = 'null';
export const API_NOT_EMPTY_VALUE_FILTER = '!null';

export const EMPTY_VALUE_FILTER_LABEL = i18n.t('Is empty');
export const NOT_EMPTY_VALUE_FILTER_LABEL = i18n.t('Is not empty');

type EmptyValueFilterData = {|
    value: string,
    isEmpty?: boolean,
    isNotEmpty?: boolean,
|};

export const isEmptyValueFilter = (value: ?string) =>
    value === EMPTY_VALUE_FILTER || value === NOT_EMPTY_VALUE_FILTER;

export const makeCheckboxHandler =
    (flag: string) =>
        (onCommit: (?string) => void) =>
            ({ checked }: {| checked: boolean |}) =>
                onCommit(checked ? flag : '');

export const fromApiEmptyValueFilter = (filter: Object): ?EmptyValueFilterData => {
    if (filter?.[API_EMPTY_VALUE_FILTER]) {
        return { isEmpty: true, value: EMPTY_VALUE_FILTER_LABEL };
    }
    if (filter?.[API_NOT_EMPTY_VALUE_FILTER]) {
        return { isNotEmpty: true, value: NOT_EMPTY_VALUE_FILTER_LABEL };
    }
    return undefined;
};


export const toApiEmptyValueFilter = (filter: EmptyValueFilterData) => {
    if (filter.isEmpty) {
        return { [API_EMPTY_VALUE_FILTER]: true };
    }
    if (filter.isNotEmpty) {
        return { [API_NOT_EMPTY_VALUE_FILTER]: true };
    }
    return undefined;
};
