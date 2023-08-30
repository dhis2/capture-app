// @flow

const valueToEscape = Object.freeze({
    COLON: ':',
    COMMA: ',',
    SLASH: '/',
});
const escape = '/';

export const escapeString = (value: string): string =>
    value
        .replace(new RegExp(valueToEscape.SLASH, 'g'), `${escape}${valueToEscape.SLASH}`)
        .replace(new RegExp(valueToEscape.COLON, 'g'), `${escape}${valueToEscape.COLON}`)
        .replace(new RegExp(valueToEscape.COMMA, 'g'), `${escape}${valueToEscape.COMMA}`);
