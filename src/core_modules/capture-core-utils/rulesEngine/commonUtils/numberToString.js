// @flow

export const numberToString = (number: number): string =>
    (isNaN(number) || number === Infinity ? '' : String(number));
