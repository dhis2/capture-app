// @flow

export const buildUrlQueryString = (queryArgs: { [id: string]: ?string }) =>
    Object
        .entries(queryArgs)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .reduce((searchParams, [key, value]) => {
            // $FlowFixMe
            value && searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams())
        .toString();
