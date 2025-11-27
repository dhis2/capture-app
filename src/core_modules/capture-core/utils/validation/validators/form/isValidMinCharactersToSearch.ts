const isValueBiggerThanMinCharactersToSearch = (value: string, minCharactersToSearch: number) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
        return true;
    }
    return minCharactersToSearch <= trimmedValue.length;
};

export const isValidMinCharactersToSearch = (value: any, minCharactersToSearch: number) => {
    if (value === undefined) {
        return true;
    }

    if (typeof value == 'string') {
        return isValueBiggerThanMinCharactersToSearch(value, minCharactersToSearch);
    }

    if ('from' in value && 'to' in value) {
        return (
            isValueBiggerThanMinCharactersToSearch(value.from, minCharactersToSearch) &&
            isValueBiggerThanMinCharactersToSearch(value.to, minCharactersToSearch)
        );
    }

    if ('date' in value) {
        return isValueBiggerThanMinCharactersToSearch(value.date, minCharactersToSearch);
    }

    return true;
};
