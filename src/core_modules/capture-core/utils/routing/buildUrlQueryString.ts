const LOCALE_EN = 'en';

export const buildUrlQueryString = (queryArgs: Readonly<Record<string, string | null | undefined>>) =>
    Object
        .entries(queryArgs)
        .filter(([, value]) => value != null)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, LOCALE_EN))
        .reduce((searchParams, [key, value]) => {
            value && searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams())
        .toString();
