// @flow

const LOCALE_EN = 'en';

export const buildUrlQueryString = (queryArgs: $ReadOnly<{ [id: string]: ?string }>) =>
    Object
        .entries(queryArgs)
        .filter(([, value]) => value != null)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, LOCALE_EN))
        .reduce((searchParams, [key, value]) => {
            // $FlowFixMe
            value && searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams())
        .toString();
