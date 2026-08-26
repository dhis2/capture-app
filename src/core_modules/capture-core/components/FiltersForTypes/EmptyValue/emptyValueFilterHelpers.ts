import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from './emptyValue.const';
import type { EmptyValueFilterData } from './emptyValue.types';

export const isEmptyValueFilter = (value: unknown): value is string =>
    typeof value === 'string' && (value === EMPTY_VALUE_FILTER || value === NOT_EMPTY_VALUE_FILTER);

export const isEmptyFilterData = (filter: Record<string, unknown>): filter is EmptyValueFilterData =>
    'isEmpty' in filter;

export const getEmptyValueFilterValue = (filter: { isEmpty: boolean }): string => (
    filter.isEmpty ? EMPTY_VALUE_FILTER : NOT_EMPTY_VALUE_FILTER
);

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
