import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
} from '../../../../components/FiltersForTypes/EmptyValue';

const isValueBiggerThanMinCharactersToSearch = (value: string, minCharactersToSearch: number) => {
    if (value === undefined) {
        return true;
    }

    const trimmedValue = value.trim();
    if (trimmedValue === '') {
        return true;
    }
    return minCharactersToSearch <= trimmedValue.length;
};

// eslint-disable-next-line complexity
const isValidMinCharactersToSearchRange = (value: { from: any; to: any }, minCharactersToSearch: number) => {
    const { from, to } = value;
    if (from === undefined && to === undefined) {
        return true;
    }
    const { date } = from || to;

    if (typeof from === 'string' || typeof to === 'string') {
        return (
            isValueBiggerThanMinCharactersToSearch(from, minCharactersToSearch) &&
            isValueBiggerThanMinCharactersToSearch(to, minCharactersToSearch)
        );
    }

    if (date) {
        return (
            isValueBiggerThanMinCharactersToSearch(from?.date, minCharactersToSearch) &&
            isValueBiggerThanMinCharactersToSearch(to?.date, minCharactersToSearch)
        );
    }

    return true;
};

const shouldSkipMinCharsValidation = (value: any) =>
    value === undefined || value === null || value === EMPTY_VALUE_FILTER || value === NOT_EMPTY_VALUE_FILTER;

export const isValidMinCharactersToSearch = (value: any, minCharactersToSearch: number) => {
    if (shouldSkipMinCharsValidation(value)) {
        return true;
    }

    const { main, from, to } = value;

    if (typeof value === 'string') {
        return isValueBiggerThanMinCharactersToSearch(value, minCharactersToSearch);
    }

    if (from || to) {
        return isValidMinCharactersToSearchRange(value, minCharactersToSearch);
    }

    if (main) {
        const ISO_DATE_LENGTH = 10;
        return minCharactersToSearch <= ISO_DATE_LENGTH;
    }

    return true;
};
