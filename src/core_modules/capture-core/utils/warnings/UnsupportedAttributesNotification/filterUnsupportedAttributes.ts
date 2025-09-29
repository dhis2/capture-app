import { isSearchSupportedAttributeType } from 'capture-core/components/SearchBox/SearchForm/unsupportedSearchTypes.const';

export type FilteredAttribute = {
    id: string;
    displayName: string;
    valueType: string;
};

/**
 * Generic function to filter unsupported attributes from a list of attributes
 * Can be used by both SearchGroupFactory and TeiSearch components
 */
export const filterUnsupportedAttributes = <T extends { valueType: string; id: string; displayName?: string; displayFormName?: string }>(
    attributes: T[],
): { supportedAttributes: T[]; filteredUnsupportedAttributes: FilteredAttribute[] } => {
    const filteredUnsupportedAttributes: FilteredAttribute[] = [];

    const supportedAttributes = attributes.filter((attribute) => {
        const isSupported = isSearchSupportedAttributeType(attribute.valueType);

        if (!isSupported) {
            filteredUnsupportedAttributes.push({
                id: attribute.id,
                displayName: attribute.displayName || attribute.displayFormName || attribute.id,
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
