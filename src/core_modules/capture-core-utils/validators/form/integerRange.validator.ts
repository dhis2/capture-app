import { isValidInteger } from './integer.validator';

const MIN_INTEGER_32 = -2147483648;
const MAX_INTEGER_32 = 2147483647;

export const isValidIntegerInRange = (
    value: string,
    _internalComponentError?: { error?: string; errorCode?: string },
): boolean => {
    if (!isValidInteger(value, _internalComponentError)) {
        return false;
    }
    const n = Number(value);
    return n >= MIN_INTEGER_32 && n <= MAX_INTEGER_32;
};
