import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
} from './constants';

export const isEmptyValueFilter = (value?: string | null): boolean =>
    value === EMPTY_VALUE_FILTER || value === NOT_EMPTY_VALUE_FILTER;

export const makeCheckboxHandler =
    (flag: string) =>
        (onCommit: (value?: string | null) => void) =>
            ({ checked }: { checked: boolean }) =>
                onCommit(checked ? flag : '');
