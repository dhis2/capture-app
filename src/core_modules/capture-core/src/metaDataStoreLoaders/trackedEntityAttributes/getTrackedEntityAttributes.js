// @flow
import chunk from '../../utils/chunk';

import metaTrackedEntityAttributesSpec from '../../api/apiSpecifications/metaTrackedEntityAttributes.apiSpecification';
import trackedEntityAttributesSpec from '../../api/apiSpecifications/trackedEntityAttributes.apiSpecification';

import getTrackedEntityAttributesLoadSpecification from '../../apiToStore/loadSpecifications/getTrackedEntityAttributesLoadSpecification';

import StorageContainer from '../../storage/StorageContainer';
import trackedEntityStoresKeys from './trackedEntityAttributesStoresKeys';

const batchSize = 50;

function getMetaTrackedEntityAttributes(
    metaAttributes: ?Array<Object>,
    trackedEntityAttributesFromPrograms: ?Array<Object>) {
    metaAttributes = metaAttributes || [];
    trackedEntityAttributesFromPrograms = trackedEntityAttributesFromPrograms || [];
    const accMetaAttributes = [...metaAttributes, ...trackedEntityAttributesFromPrograms];
    const filteredMetaAttributes = accMetaAttributes.reduce((accFilteredMetaAttributes, metaAttribute) => {
        if (!accFilteredMetaAttributes.some(attribute => attribute.id === metaAttribute.id)) {
            accFilteredMetaAttributes.push(metaAttribute);
        }
        return accFilteredMetaAttributes;
    }, []);

    return filteredMetaAttributes;
}

function getTrackedEntityAttributeIds(trackedEntityAttributes) {
    return trackedEntityAttributes.map(attribute => attribute.id);
}


async function getTrackedEntityAttributes(ids: Array<number>, store: string, storageContainer: StorageContainer) {
    trackedEntityAttributesSpec.updateQueryParams({
        filter: `id:in:[${ids.toString()}]`,
    });

    return getTrackedEntityAttributesLoadSpecification(store, trackedEntityAttributesSpec).load(storageContainer);
}

async function getIdsForOptionSetsToRetrieve(
    metaTrackedEntityAttributes,
    optionSetStore: string,
    storageContainer: StorageContainer) {
    let optionSetIds = [];

    if (metaTrackedEntityAttributes) {
        const includeOptionSetIdIfApplicable = (metaOptionSet, storeOptionSet) => {
            if ((!storeOptionSet || storeOptionSet.version !== metaOptionSet.version)
                && (!optionSetIds.includes(metaOptionSet.id))) {
                return metaOptionSet.id;
            }
            return null;
        };

        const attributePromises = metaTrackedEntityAttributes.reduce((accPromises, teAttribute) => {
            if (teAttribute.optionSet && teAttribute.optionSet.id) {
                const optionSet = teAttribute.optionSet;
                const resolvedPromise = storageContainer.get(optionSetStore, optionSet.id)
                    .then(storeData => includeOptionSetIdIfApplicable(optionSet, storeData));
                accPromises.push(resolvedPromise);
            }
            return accPromises;
        }, []);

        const missingOptionSetIdsAsArray = await Promise.all(attributePromises);
        optionSetIds = missingOptionSetIdsAsArray.filter(optionSetId => !!optionSetId);
    }
    return optionSetIds;
}

export default async function getTrackedEntityAttributesData(
    storageContainer: StorageContainer,
    stores: Object,
    trackedEntityAttributesFromPrograms?: ?Array<Object>) {
    let metaAttributes = await metaTrackedEntityAttributesSpec.get();
    metaAttributes = getMetaTrackedEntityAttributes(metaAttributes, trackedEntityAttributesFromPrograms);
    const missingOptionSetIdsFromTrackedEntityAttributes = await getIdsForOptionSetsToRetrieve(metaAttributes, stores[trackedEntityStoresKeys.OPTION_SETS], storageContainer);
    const attributeIdBatches = chunk(getTrackedEntityAttributeIds(metaAttributes), batchSize);

    await Promise.all(
        attributeIdBatches.map(
            batch =>
                getTrackedEntityAttributes(batch, stores[trackedEntityStoresKeys.TRACKED_ENTITY_ATTRIBUTES], storageContainer),
        ),
    );

    return { missingOptionSetIdsFromTrackedEntityAttributes };
}
