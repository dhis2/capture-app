/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
const emailRegExp = new RegExp(
    '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidEmail = (
    value: string,
) => emailRegExp.test(value);
