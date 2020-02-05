
// @flow
/* eslint-disable complexity */

export function isEqual(a: any, b: any) {
    if (a === b) {
        return true;
    }

    if (!a || !b) {
        return false;
    }

    const typeOfA = typeof a;
    const typeOfB = typeof b;
    if (typeOfA !== 'object' || typeOfA !== typeOfB || Array.isArray(a) !== Array.isArray(b)) {
        return false;
    }

    if (Array.isArray(a)) {
        return a.every((value, index) => isEqual(value, b[index]));
    }

    const allKeys = [...Object.keys(a), ...Object.keys(b)];
    const uniqueKeys = [...new Set(allKeys).values()];

    return uniqueKeys
        .every(key => isEqual(a[key], b[key]));
}
