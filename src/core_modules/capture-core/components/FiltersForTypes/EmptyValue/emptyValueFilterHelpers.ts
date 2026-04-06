import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from './constants';
import type { EmptyValueFilterData } from './types';

export const isEmptyValueFilter = (value?: string | null): boolean =>
    value === EMPTY_VALUE_FILTER || value === NOT_EMPTY_VALUE_FILTER;

export const getEmptyValueFilterData = (value: string): EmptyValueFilterData => (
    value === EMPTY_VALUE_FILTER
        ? { value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
        : { value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false }
);

export const makeCheckboxHandler =
    (flag: string) =>
        (onCommit: (value?: string | null) => void) =>
            ({ checked }: { checked: boolean }) =>
                onCommit(checked ? flag : '');
