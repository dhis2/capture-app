const LOCALE_EN = 'en';

type QueryArgs = Readonly<Record<string, string | null | undefined>>;

export const buildUrlQueryString = (queryArgs: QueryArgs): string =>
    Object
        .entries(queryArgs)
        .filter(([, value]) => value != null)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, LOCALE_EN))
        .reduce((searchParams, [key, value]) => {
            if (value) {
                searchParams.append(key, value);
            }
            return searchParams;
        }, new URLSearchParams())
        .toString();
