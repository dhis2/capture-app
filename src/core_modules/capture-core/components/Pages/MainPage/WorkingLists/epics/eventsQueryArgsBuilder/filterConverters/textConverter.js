// @flow
import type { TextFilterData } from '../../../../../../FiltersForTypes/filters.types';

export function convertText(filter: TextFilterData) {
  return `like:${filter.value}`;
}
