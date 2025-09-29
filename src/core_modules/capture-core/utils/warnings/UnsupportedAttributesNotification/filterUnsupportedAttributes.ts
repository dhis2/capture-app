import { isSearchSupportedAttributeType } from 'capture-core/utils/warnings/UnsupportedAttributesNotification/unsupportedSearchTypes.const';

export type FilteredAttribute = {
    id: string;
    displayName: string;
    valueType: string;
};

export const filterUnsupportedAttributes = (attributes: FilteredAttribute[]): FilteredAttribute[] => attributes.filter(attribute => !isSearchSupportedAttributeType(attribute.valueType));
