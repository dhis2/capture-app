// @flow
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';

export function getErrorMessageAndDetails(error: any) {
    if (!error) {
        return {
            message: null,
            details: null,
        };
    }

    const message = isString(error) ? error : error.message;
    const details = isObject(error) ? error : null;

    return {
        message,
        details,
    };
}
