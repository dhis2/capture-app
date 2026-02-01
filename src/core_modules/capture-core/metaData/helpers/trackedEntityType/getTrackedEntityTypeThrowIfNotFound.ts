import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { trackedEntityTypesCollection } from '../../../metaDataMemoryStores';
import type { TrackedEntityType } from '../../TrackedEntityType';

const errorMessages = {
    TRACKED_ENTITY_TYPE_NOT_FOUND: 'Tracked entity type not found',
};

export function getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId: string): TrackedEntityType {
    const trackedEntityType = trackedEntityTypesCollection.get(trackedEntityTypeId);
    if (!trackedEntityType) {
        log.error(errorCreator(errorMessages.TRACKED_ENTITY_TYPE_NOT_FOUND)({ trackedEntityTypeId }));
        throw Error(i18n.t('An error has occurred. See log for details'));
    }
    return trackedEntityType;
}

