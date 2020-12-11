// @flow
import { chunk } from 'capture-core-utils';
import { queryTrackedEntityTypesOutline } from './queries';
import { storeTrackedEntityTypes } from './quickStoreOperations';

const loadTrackedEntityTypesBatch = async (idBatch: Array<string>) => {
  const { convertedData: loadedTrackedEntityTypes = [] } = await storeTrackedEntityTypes(idBatch);
  return loadedTrackedEntityTypes.map((trackedEntityType) => ({
    trackedEntityTypeAttributes: trackedEntityType.trackedEntityTypeAttributes,
  }));
};

const getSideEffects = (() => {
  const getOptionSetsOutline = (trackedEntityTypesOutline): Array<Object> =>
    trackedEntityTypesOutline.flatMap((trackedEntityTypeOutline) =>
      trackedEntityTypeOutline.trackedEntityTypeAttributes
        .map(
          (trackedEntityTypeAttribute) =>
            trackedEntityTypeAttribute.trackedEntityAttribute &&
            trackedEntityTypeAttribute.trackedEntityAttribute.optionSet,
        )
        .filter((optionSet) => optionSet),
    );

  const getTrackedEntityAttributeIds = (trackedEntityTypes: Array<Object>): Array<Object> =>
    trackedEntityTypes.flatMap((trackedEntityType) =>
      (trackedEntityType.trackedEntityTypeAttributes || [])
        .map((trackedEntityTypeAttribute) => trackedEntityTypeAttribute.trackedEntityAttributeId)
        .filter((trackedEntityAttributeId) => trackedEntityAttributeId),
    );

  return async (trackedEntityTypes) => {
    const trackedEntityTypesOutline = await queryTrackedEntityTypesOutline();
    return {
      trackedEntityAttributeIds: getTrackedEntityAttributeIds(trackedEntityTypes),
      optionSetsOutline: getOptionSetsOutline(trackedEntityTypesOutline),
    };
  };
})();

/**
 * Retrieve and store tracked entity types based on the tracked entity type ids argument.
 * The tracked entity type ids input is determined from the stale programs (programs where the program version has changed).
 * We chunk the tracked entity type ids in chunks of smaller sizes in order to comply with a potential url path limit and
 * to improve performance, mainly by reducing memory consumption on both the client and the server.
 */
export const loadTrackedEntityTypes = async (trackedEntityTypeIds: Array<string>) => {
  const idBatches = chunk(trackedEntityTypeIds, 150);
  const trackedEntityTypesDataForSideEffects = (
    await Promise.all(idBatches.map(loadTrackedEntityTypesBatch))
  ).flat(1);

  return getSideEffects(trackedEntityTypesDataForSideEffects);
};
