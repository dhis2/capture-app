// @flow
import StorageController from '../../storage/StorageController';
import { metaTrackedEntityTypesApiSpecification, trackedEntityTypesApiSpecification } from '../../api';
import getTrackedEntityTypesLoadSpecification
    from '../../apiToStore/loadSpecifications/getTrackedEntityTypesLoadSpecification';

function getOptionSetsMeta(trackedEntityTypesMeta) {
    if (!trackedEntityTypesMeta) {
        return [];
    }

    const optionSetsMeta = trackedEntityTypesMeta.reduce((accOptionSetsMeta, type) => {
        const optionSetsMetaForType = type.trackedEntityTypeAttributes &&
            type.trackedEntityTypeAttributes.reduce((accOptionSetsMetaForType, TETA) => {
                if (TETA.trackedEntityAttribute && TETA.trackedEntityAttribute.optionSet) {
                    accOptionSetsMetaForType.push(TETA.trackedEntityAttribute.optionSet);
                }
                return accOptionSetsMetaForType;
            }, []);

        if (optionSetsMetaForType) {
            accOptionSetsMeta = [...accOptionSetsMeta, ...optionSetsMetaForType];
        }

        return accOptionSetsMeta;
    }, []);
    return optionSetsMeta;
}


export default async function loadTrackedEntityTypes(
    storageController: StorageController,
    storeName: string,
) {
    const trackedEntityTypesMeta = await metaTrackedEntityTypesApiSpecification.get();
    const optionSetsMeta = getOptionSetsMeta(trackedEntityTypesMeta);
    const trackedEntityTypesLoadSpecification =
        getTrackedEntityTypesLoadSpecification(storeName, trackedEntityTypesApiSpecification);
    const loadedTrackedEntityTypes = await trackedEntityTypesLoadSpecification.load(storageController);

    let trackedEntityAttributeIds = [];
    if (loadedTrackedEntityTypes) {
        trackedEntityAttributeIds = loadedTrackedEntityTypes.reduce((accAttributeIds, TET) => {
            if (TET.trackedEntityTypeAttributes) {
                const attributeIds = TET
                    .trackedEntityTypeAttributes
                    .map(TETA => TETA.trackedEntityAttribute && TETA.trackedEntityAttribute.id)
                    .filter(TEAId => TEAId);

                return [...accAttributeIds, ...attributeIds];
            }
            return accAttributeIds;
        }, trackedEntityAttributeIds);
    }

    return {
        trackedEntityAttributeIds,
        optionSetsMeta,
    };
}
