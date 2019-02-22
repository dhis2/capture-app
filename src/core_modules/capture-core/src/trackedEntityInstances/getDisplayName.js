// @flow
import i18n from '@dhis2/d2-i18n';
import { TrackedEntityType } from '../metaData';


export default function getDisplayName(values: {[attrId: string]: any }, trackedEntityType: ?TrackedEntityType) {
    if (!trackedEntityType) {
        return i18n.t('Tracked entity instance');
    }

    const valueIds = Object.keys(values);

    const displayValues = trackedEntityType.attributes.filter(a => valueIds.some(id => id === a.id) && a.displayInReports);

    if (!displayValues || displayValues.length === 0) {
        return trackedEntityType.name;
    }

    return displayValues.slice(0, 2)
        .map(a => values[a.id])
        .join(' ');
}
