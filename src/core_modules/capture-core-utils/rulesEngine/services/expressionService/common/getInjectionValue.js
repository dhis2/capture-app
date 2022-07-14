// @flow

export const getInjectionValue = (rawValue: any) => {
    const nonEmptyValue = rawValue != null ? rawValue : '';
    // if string, we will sanitize and encapsulate the value
    return typeof nonEmptyValue === 'string' ? `"${nonEmptyValue.replace(/"/g, '\'')}"` : nonEmptyValue;
};
