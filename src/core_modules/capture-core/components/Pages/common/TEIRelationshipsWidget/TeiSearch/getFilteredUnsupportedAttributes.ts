import type { SearchGroup } from '../../../../../metaData';
import { getTrackedEntityTypeThrowIfNotFound, getTrackerProgramThrowIfNotFound } from '../../../../../metaData';
import { filterUnsupportedAttributes, type FilteredAttribute } from '../../../../../utils/warnings/UnsupportedAttributesNotification';

export const getFilteredUnsupportedAttributes = (
    searchGroups: SearchGroup[],
    selectedTrackedEntityTypeId: string,
    selectedProgramId?: string | null,
): FilteredAttribute[] => {
    // Get the original attributes from either the program or tracked entity type
    let originalAttributes: Array<{ id: string; displayName: string; valueType: string }> = [];

    try {
        if (selectedProgramId) {
            const program = getTrackerProgramThrowIfNotFound(selectedProgramId);
            originalAttributes = program.attributes.map(attr => ({
                id: attr.id,
                displayName: attr.formName,
                valueType: attr.type,
            }));
        } else {
            const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(selectedTrackedEntityTypeId);
            originalAttributes = trackedEntityType.attributes.map(attr => ({
                id: attr.id,
                displayName: attr.formName,
                valueType: attr.type,
            }));
        }
    } catch (error) {
        console.error('Error getting original attributes:', error);
        return [];
    }

    // Use the shared filtering function to get unsupported attributes
    const { filteredUnsupportedAttributes } = filterUnsupportedAttributes(originalAttributes);
    return filteredUnsupportedAttributes;
};
