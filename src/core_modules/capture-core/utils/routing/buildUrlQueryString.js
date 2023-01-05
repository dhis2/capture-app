// @flow

const LOCALE_EN = 'en';

export const buildUrlQueryString = (queryArgs: { [id: string]: string }) =>
    Object
        .entries(queryArgs)
        .sort((a, b) => a[0].localeCompare(b[0], LOCALE_EN))
        .reduce((searchParams, [key, value]) => {
            // $FlowFixMe
            value && searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams())
        .toString();
