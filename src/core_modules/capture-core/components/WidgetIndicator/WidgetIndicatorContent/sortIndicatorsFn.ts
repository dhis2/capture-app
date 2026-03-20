import { localeCompareStrings } from '../../../utils/localeCompareStrings';

function compareIndicatorFieldToString(a, str: string) {
    return (
        (a.key && localeCompareStrings(a.key, str)) || (a.message && localeCompareStrings(a.message, str))
    );
}

export const sortIndicatorsFn = (a, b): number => {
    if (typeof b === 'string') {
        return compareIndicatorFieldToString(a, b);
    }
    if (b.message) {
        return compareIndicatorFieldToString(a, b.message);
    }
    if (b.key) {
        return compareIndicatorFieldToString(a, b.key);
    }
    return 1;
};
