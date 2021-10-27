// @flow
import type { BrowserHistory } from 'history';
import { type Url } from '../url';

export const deriveURLParamsFromHistory = (history: BrowserHistory): Url =>
    [...new URLSearchParams(history.location.search).entries()].reduce((accParams, entry) => {
        accParams[entry[0]] = entry[1];
        return accParams;
    }, {});
