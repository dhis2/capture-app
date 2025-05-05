import { localeCompareStrings } from '../../../utils/localeCompareStrings';
import type { WidgetData } from '../../WidgetFeedback/WidgetFeedback.types';

export const sortIndicatorsFn = (a: WidgetData, b: WidgetData): number => {
    if (typeof b === 'string') {
        if (typeof a === 'object') {
            return (('key' in a && a.key && localeCompareStrings(a.key, b)) ||
                   ('message' in a && a.message && localeCompareStrings(a.message, b))) || 0;
        }
        return localeCompareStrings(a, b);
    }
    if (typeof a === 'string') {
        if ('message' in b && b.message) {
            return localeCompareStrings(a, b.message);
        }
        if ('key' in b && b.key) {
            return localeCompareStrings(a, b.key);
        }
        return 1;
    }
    if ('message' in b && b.message) {
        if ('key' in a && a.key) {
            return localeCompareStrings(a.key, b.message);
        }
        if ('message' in a && a.message) {
            return localeCompareStrings(a.message, b.message);
        }
    }
    if ('key' in b && b.key) {
        if ('key' in a && a.key) {
            return localeCompareStrings(a.key, b.key);
        }
        if ('message' in a && a.message) {
            return localeCompareStrings(a.message, b.key);
        }
    }
    return 1;
};
