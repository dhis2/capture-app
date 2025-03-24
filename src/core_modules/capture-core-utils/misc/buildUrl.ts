// @flow

export const buildUrl = (...urlParts: string[]): string =>
    urlParts
        .map(part => part.replace(/(^\/)|(\/$)/, ''))
        .join('/');
