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

function validateMinOrMaxField(
    field: unknown,
    minCharactersToSearch: number,
): boolean {
    if (field == null) {
        return true;
    }
    if (typeof field === 'string') {
        return isValueBiggerThanMinCharactersToSearch(field, minCharactersToSearch);
    }
    return true;
}

const isValidMinCharactersToSearchMinMax = (value: { min?: unknown; max?: unknown }, minCharactersToSearch: number) => {
    const minValid = validateMinOrMaxField(value.min, minCharactersToSearch);
    const maxValid = validateMinOrMaxField(value.max, minCharactersToSearch);
    return minValid && maxValid;
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

    if ('min' in value || 'max' in value) {
        return isValidMinCharactersToSearchMinMax(value, minCharactersToSearch);
    }

    if ('date' in value) {
        return isValueBiggerThanMinCharactersToSearch(value.date, minCharactersToSearch);
    }

    return true;
};
