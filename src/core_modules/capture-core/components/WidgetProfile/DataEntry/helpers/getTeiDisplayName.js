// @flow
import i18n from '@dhis2/d2-i18n';

const DEFAULT_NAME = i18n.t('tracked entity instance');

const getAttributesValues = (attributes, firstId, secondId) => {
    const firstValue = attributes.find(({ attribute }) => attribute === firstId)?.value || '';
    const secondValue = attributes.find(({ attribute }) => attribute === secondId)?.value || '';
    return firstValue || secondValue ? `${firstValue}${firstValue && ' '}${secondValue}` : '';
};

const getTetAttributesDisplayInList = (attributes, tetAttributes) => {
    const [firstId, secondId] = tetAttributes
        .filter(({ displayInList }) => displayInList)
        .map(({ trackedEntityAttribute }) => trackedEntityAttribute.id);
    return getAttributesValues(attributes, firstId, secondId);
};

const getTetAttributes = (attributes, tetAttributes) => {
    const [firstId, secondId] = tetAttributes.map(({ id }) => id);
    return getAttributesValues(attributes, firstId, secondId);
};

export const getTeiDisplayName = (
    program: any,
    storedAttributeValues: Array<{ [attrId: string]: any }>,
    attributes: Array<any>,
    fallbackName?: ?string,
) => {
    const tetAttributes = program?.trackedEntityType?.trackedEntityTypeAttributes;
    const updatedAttributes = attributes.map(attribute => ({
        ...attribute,
        value: storedAttributeValues.find(storedAttributeValue => storedAttributeValue.attribute === attribute.attribute)?.value,
    }));
    if (!tetAttributes || !updatedAttributes) return fallbackName || DEFAULT_NAME;

    const teiNameDisplayInReports = getTetAttributesDisplayInList(updatedAttributes, tetAttributes);
    if (teiNameDisplayInReports) return teiNameDisplayInReports;

    const teiName = getTetAttributes(updatedAttributes, tetAttributes);
    if (teiName) return teiName;

    return fallbackName || DEFAULT_NAME;
};
