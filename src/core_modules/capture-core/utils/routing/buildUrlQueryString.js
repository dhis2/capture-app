// @flow

import { pathnames } from '../url';

export const buildUrlQueryString = (pageToPush: string = pathnames.MAIN_PAGE, queryArgs: { [id: string]: ?string }) => {
    const queryArgsString = Object
        .entries(queryArgs)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .reduce((searchParams, [key, value]) => {
            // $FlowFixMe
            value && searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams())
        .toString();

    return pageToPush.concat('?', queryArgsString);
};
