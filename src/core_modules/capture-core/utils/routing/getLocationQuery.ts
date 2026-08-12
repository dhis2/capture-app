// Cached across calls — window.location.hash doesn't change mid-render, but
// this is called from hot paths (customLabels wrapper, epics) that would
// otherwise re-parse the URL and allocate a new object on every invocation.
let cachedHash: string | undefined;
let cachedQuery: Readonly<Record<string, string>> | undefined;

export const getLocationQuery = (): any => {
    const hash = window.location.hash;
    if (cachedQuery && hash === cachedHash) return cachedQuery;
    const urlSearchParamString = hash.split('?')[1];
    const query = [...new URLSearchParams(urlSearchParamString).entries()].reduce<Record<string, string>>(
        (accParams, [key, value]) => {
            accParams[key] = value;
            return accParams;
        },
        {},
    );
    cachedHash = hash;
    cachedQuery = Object.freeze(query);
    return cachedQuery;
};
