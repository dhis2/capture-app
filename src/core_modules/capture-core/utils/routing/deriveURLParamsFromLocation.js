// @flow

export const deriveURLParamsFromLocation = (): {| [key: string]: string |} => {
    const urlSearch = window.location.hash.split('?');
    return [...new URLSearchParams(urlSearch[1]).entries()].reduce((accParams, entry) => {
        accParams[entry[0]] = entry[1];
        return accParams;
    }, {});
};
