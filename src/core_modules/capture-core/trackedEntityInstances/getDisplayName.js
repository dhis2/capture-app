// @flow
import i18n from '@dhis2/d2-i18n';
import type { DataElement } from '../metaData';
import { convertClientToView } from '../converters';

const DEFAULT_NAME = i18n.t('tracked entity instance');

export default function getDisplayName(
  values: { [attrId: string]: any },
  attributes: Array<DataElement>,
  fallbackName?: ?string,
) {
  const valueIds = Object.keys(values);
  const displayValues = attributes.filter(
    (a) => valueIds.some((id) => id === a.id) && a.displayInReports,
  );

  if (displayValues.length === 0) {
    return fallbackName || DEFAULT_NAME;
  }

  return displayValues
    .slice(0, 2)
    .map((a) => a.convertValue(values[a.id], convertClientToView))
    .join(' ');
}
