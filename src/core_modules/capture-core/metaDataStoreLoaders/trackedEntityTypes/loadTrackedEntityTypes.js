// @flow
import { queryTrackedEntityTypesOutline } from './queries';
import { storeTrackedEntityTypes } from './quickStoreOperations';

function getOptionSetsOutline(trackedEntityTypesOutline) {
    const optionSetsOutline = trackedEntityTypesOutline.reduce((accOptionSets, type) => {
        const optionSetsForType = type.trackedEntityTypeAttributes &&
            type.trackedEntityTypeAttributes.reduce((accOptionSetsForType, TETA) => {
                if (TETA.trackedEntityAttribute && TETA.trackedEntityAttribute.optionSet) {
                    accOptionSetsForType.push(TETA.trackedEntityAttribute.optionSet);
                }
                return accOptionSetsForType;
            }, []);

        if (optionSetsForType) {
            accOptionSets = [...accOptionSets, ...optionSetsForType];
        }

        return optionSetsForType;
    }, []);
    return optionSetsOutline;
}


export async function loadTrackedEntityTypes(
) {
    const trackedEntityTypesOutline = await queryTrackedEntityTypesOutline();
    const optionSetsOutline = getOptionSetsOutline(trackedEntityTypesOutline);
    const { convertedData: loadedTrackedEntityTypes } = await storeTrackedEntityTypes();

    let trackedEntityAttributeIds = [];
    if (loadedTrackedEntityTypes) {
        trackedEntityAttributeIds = loadedTrackedEntityTypes.reduce((accAttributeIds, TET) => {
            if (TET.trackedEntityTypeAttributes) {
                const attributeIds = TET
                    .trackedEntityTypeAttributes
                    .map(TETA => TETA.trackedEntityAttributeId)
                    .filter(TEAId => TEAId);

                return [...accAttributeIds, ...attributeIds];
            }
            return accAttributeIds;
        }, trackedEntityAttributeIds);
    }

    return {
        trackedEntityAttributeIds,
        optionSetsOutline,
    };
}
