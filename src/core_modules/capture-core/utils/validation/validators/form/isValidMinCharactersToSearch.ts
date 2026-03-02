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
            isValueBiggerThanMinCharactersToSearch(from.date, minCharactersToSearch) &&
            isValueBiggerThanMinCharactersToSearch(to.date, minCharactersToSearch)
        );
    }

    return true;
};

// eslint-disable-next-line complexity
export const isValidMinCharactersToSearch = (value: any, minCharactersToSearch: number) => {
    if (value === undefined || value === EMPTY_VALUE_FILTER || value === NOT_EMPTY_VALUE_FILTER) {
        return true;
    }

    const { main, from, to } = value;

    if (typeof value === 'string') {
        return isValueBiggerThanMinCharactersToSearch(value, minCharactersToSearch);
    }

    if (main) {
        const ISO_DATE_LENGTH = 10;
        return minCharactersToSearch <= ISO_DATE_LENGTH;
    }

    if (from || to) {
        return isValidMinCharactersToSearchRange(value, minCharactersToSearch);
    }

    if ('date' in value) {
        return isValueBiggerThanMinCharactersToSearch(value.date, minCharactersToSearch);
    }

    return true;
};
