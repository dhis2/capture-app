// @flow

export const buildUrl = (...urlParts: Array<string>) =>
    urlParts
        .map(part => part.replace(/(^\/)|(\/$)/, ''))
        .join('/');
