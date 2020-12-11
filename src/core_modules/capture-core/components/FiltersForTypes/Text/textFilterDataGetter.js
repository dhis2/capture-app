// @flow
import type { TextFilterData } from '../filters.types';

export function getTextFilterData(value: string): TextFilterData {
  return {
    value,
  };
}
