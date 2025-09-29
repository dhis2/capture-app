import { isSearchSupportedAttributeType } from 'capture-core/utils/warnings/UnsupportedAttributesNotification/unsupportedSearchTypes.const';

export type FilteredAttribute = {
    id: string;
    displayName: string;
    valueType: string;
};

/**
 * Generic function to filter unsupported attributes from a list of attributes
 * Can be used by both SearchGroupFactory and TeiSearch components
 */
export const filterUnsupportedAttributes = <T extends { valueType: string; id: string; displayName: string }>(
    attributes: T[],
): { supportedAttributes: T[]; filteredUnsupportedAttributes: FilteredAttribute[] } => {
    const filteredUnsupportedAttributes: FilteredAttribute[] = [];

    console.log('attributes', attributes);

    const supportedAttributes = attributes.filter((attribute) => {
        const isSupported = isSearchSupportedAttributeType(attribute.valueType);
        console.log('isSupported', isSupported, attribute.valueType);

        if (!isSupported) {
            filteredUnsupportedAttributes.push({
                id: attribute.id,
                displayName: attribute.displayName,
                valueType: attribute.valueType,
            });
        }

        return isSupported;
    });

    return {
        supportedAttributes,
        filteredUnsupportedAttributes,
    };
};
