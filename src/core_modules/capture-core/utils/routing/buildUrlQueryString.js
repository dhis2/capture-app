// @flow

export const buildUrlQueryString = (queryArgs: { [id: string]: ?string }) =>
    Object
        .entries(queryArgs)
        .reduce((searchParams, [key, value]) => {
            // $FlowFixMe
            value && searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams())
        .toString();
