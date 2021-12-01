// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import type { TrackedEntityType } from '../../TrackedEntityType';
import { trackedEntityTypesCollection } from '../../../metaDataMemoryStores';

const errorMessages = {
    TRACKED_ENTITY_TYPE_NOT_FOUND: 'Tracked entity type not found',
    GENERIC_ERROR: 'An error has occured. See log for details',
};

export function getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId: string): TrackedEntityType {
    const trackedEntityType = trackedEntityTypesCollection.get(trackedEntityTypeId);
    if (!trackedEntityType) {
        log.error(errorCreator(errorMessages.TRACKED_ENTITY_TYPE_NOT_FOUND)({ trackedEntityTypeId }));
        throw Error(i18n.t(errorMessages.GENERIC_ERROR));
    }
    return trackedEntityType;
}

