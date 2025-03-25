/* eslint-disable complexity */
import { localeCompareStrings } from '../../../utils/localeCompareStrings';
import { WidgetData, FilteredText, FilteredKeyValue } from '../../WidgetFeedback/WidgetFeedback.types';

export const sortIndicatorsFn = (a: WidgetData, b: WidgetData): number => {
  if (typeof b === 'string') {
    if (typeof a === 'object') {
      if ('key' in a) {
        return localeCompareStrings(a.key, b) || 0;
      } else if ('message' in a) {
        return localeCompareStrings(a.message, b) || 0;
      }
    }
  } else if (typeof b === 'object') {
    if ('message' in b) {
      if (typeof a === 'object') {
        if ('key' in a) {
          return localeCompareStrings(a.key, b.message) || 0;
        } else if ('message' in a) {
          return localeCompareStrings(a.message, b.message) || 0;
        }
      }
    } else if ('key' in b) {
      if (typeof a === 'object') {
        if ('key' in a) {
          return localeCompareStrings(a.key, b.key) || 0;
        } else if ('message' in a) {
          return localeCompareStrings(a.message, b.key) || 0;
        }
      }
    }
  }
  return 1;
};
