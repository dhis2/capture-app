/* eslint-disable complexity */
import { localeCompareStrings } from '../../../utils/localeCompareStrings';

export const sortIndicatorsFn = (a, b) => {
    if (typeof b === 'string') {
        return ((a.key && localeCompareStrings(a.key, b)) || (a.message && localeCompareStrings(a.message, b)));
    }
    if (b.message) {
        return (
            (a.key && localeCompareStrings(a.key, b.message)) ||
            (a.message && localeCompareStrings(a.message, b.message))
        );
    }
    if (b.key) {
        return ((a.key && localeCompareStrings(a.key, b.key)) || (a.message && localeCompareStrings(a.message, b.key)));
    }
    return 1;
};
