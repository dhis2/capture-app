import type { SearchGroup } from '../../../../../metaData';
import { filterUnsupportedAttributes, type FilteredAttribute } from '../../../../../utils/warnings/UnsupportedAttributesNotification';

/**
 * Extracts filtered unsupported attributes from SearchGroups
 * Uses the same approach as buildSearchGroup but works with DataElements directly
 * since SearchGroups already contain the processed tracked entity attribute data
 */
export const getFilteredUnsupportedAttributes = (searchGroups: SearchGroup[]): FilteredAttribute[] => {
    // Extract tracked entity attributes from SearchGroup DataElements
    // The DataElement.id corresponds to the tracked entity attribute ID
    // and DataElement contains the processed attribute information
    const trackedEntityAttributes: Array<{ id: string; displayName: string; valueType: string }> = [];

    searchGroups.forEach((searchGroup) => {
        if (searchGroup.searchForm) {
            const elements = searchGroup.searchForm.getElements();
            elements.forEach((element) => {
                trackedEntityAttributes.push({
                    id: element.id,
                    displayName: element.formName,
                    valueType: element.type,
                });
            });
        }
    });

    // Use the shared filtering function
    const { filteredUnsupportedAttributes } = filterUnsupportedAttributes(trackedEntityAttributes);
    return filteredUnsupportedAttributes;
};
