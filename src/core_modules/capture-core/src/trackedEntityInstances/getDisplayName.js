// @flow
import i18n from '@dhis2/d2-i18n';
import { DataElement } from '../metaData';


export default function getDisplayName(
    values: {[attrId: string]: any },
    attributes: Array<DataElement>,
    fallbackName?: ?string,
) {
    const valueIds = Object.keys(values);

    const displayValues = attributes.filter(a => valueIds.some(id => id === a.id) && a.displayInReports);

    if (displayValues.length === 0) {
        return fallbackName || i18n.t('tracked entity instance');
    }

    return displayValues.slice(0, 2)
        .map(a => values[a.id])
        .join(' ');
}
