// @flow
import { EMPTY_FILTER_VALUE, NOT_EMPTY_FILTER_VALUE } from '../constants';

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
