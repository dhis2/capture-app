// @flow
import i18n from '@dhis2/d2-i18n';
import { convertClientToView } from '../../../../converters';

const DEFAULT_NAME = i18n.t('tracked entity instance');

export function getTeiDisplayName(storedAttributeValues: Array<{ [attrId: string]: any }>, attributes: Array<any>, fallbackName?: ?string) {
    const displayValues = attributes
        .map(attribute => ({
            ...attribute,
            value: storedAttributeValues.find(storedAttributeValue => storedAttributeValue.attribute === attribute.attribute)?.value,
        }))
        .filter(attribute => attribute.displayInList);

    if (displayValues.length === 0) {
        return fallbackName || DEFAULT_NAME;
    }

    return displayValues
        .slice(0, 2)
        .map(displayValue => convertClientToView(displayValue.value, displayValue.valueType))
        .join(' ');
}
