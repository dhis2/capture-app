// @flow

export const deriveURLParamsFromLocation = (): {| [key: string]: string |} => {
    const urlSearchParamString = window.location.hash.split('?')[1];
    return [...new URLSearchParams(urlSearchParamString).entries()].reduce((accParams, [key, value]) => {
        accParams[key] = value;
        return accParams;
    }, {});
};
