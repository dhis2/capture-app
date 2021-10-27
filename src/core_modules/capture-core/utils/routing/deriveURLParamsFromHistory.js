// @flow
export const deriveURLParamsFromHistory = (history: string) =>
    [...new URLSearchParams(history.location.search).entries()].reduce((accParams, entry) => {
        accParams[entry[0]] = entry[1];
        return accParams;
    }, {});
