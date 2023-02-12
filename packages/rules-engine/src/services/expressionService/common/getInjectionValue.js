// @flow

const passOnTypes = ['number', 'boolean'];

/*
As a safety measure we will only allow values of type string, number and boolean
to be injected into the expression.
Strings will be sanitized and encapsulated in double quotes.
The value returned from this function will always be a string though
because the return value will be part of a string that we will run eval / new Function on.
*/
export const getInjectionValue = (rawValue: any): string => {
    const nonEmptyValue = rawValue != null ? rawValue : '';

    const typeOfValue = typeof nonEmptyValue;

    if (typeOfValue === 'string') {
        // we will sanitize and encapsulate string values
        return `"${nonEmptyValue.replace(/"/g, '\'')}"`;
    }

    if (passOnTypes.includes(typeOfValue)) {
        return nonEmptyValue.toString();
    }

    return false.toString();
};
