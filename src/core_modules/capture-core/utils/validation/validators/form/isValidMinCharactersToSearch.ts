const isValueBiggerThanMinCharactersToSearch = (value: string, minCharactersToSearch: number) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
        return true;
    }
    return minCharactersToSearch <= trimmedValue.length;
};

const isValidMinCharactersToSearchRange = (value: { from: any; to: any }, minCharactersToSearch: number) => {
    const { from, to } = value;

    if (typeof from === 'string' && typeof to === 'string') {
        return (
            isValueBiggerThanMinCharactersToSearch(from, minCharactersToSearch) &&
            isValueBiggerThanMinCharactersToSearch(to, minCharactersToSearch)
        );
    }

    if ('date' in from && 'date' in to) {
        return (
            isValueBiggerThanMinCharactersToSearch(from.date, minCharactersToSearch) &&
            isValueBiggerThanMinCharactersToSearch(to.date, minCharactersToSearch)
        );
    }

    return true;
};

export const isValidMinCharactersToSearch = (value: any, minCharactersToSearch: number) => {
    if (value === undefined) {
        return true;
    }

    if (typeof value === 'string') {
        return isValueBiggerThanMinCharactersToSearch(value, minCharactersToSearch);
    }

    if ('from' in value && 'to' in value) {
        return isValidMinCharactersToSearchRange(value, minCharactersToSearch);
    }

    if ('date' in value) {
        return isValueBiggerThanMinCharactersToSearch(value.date, minCharactersToSearch);
    }

    return true;
};
