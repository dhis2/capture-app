// @flow
import type { BrowserHistory } from 'history';

export const deriveURLParamsFromHistory = (history: BrowserHistory): {| [key: string]: string |} =>
    [...new URLSearchParams(history.location.search).entries()].reduce((accParams, entry) => {
        accParams[entry[0]] = entry[1];
        return accParams;
    }, {});
