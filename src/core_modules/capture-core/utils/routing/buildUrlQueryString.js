// @flow

export const buildUrlQueryString = (pageToPush: string, queryArgs: { [id: string]: ?string }) => {
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
