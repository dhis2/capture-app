import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../../../../metaData';

export const getTeiRegistrationMetadata = (TETypeId) => {
    let TEType;
    try {
        TEType = getTrackedEntityTypeThrowIfNotFound(TETypeId);
    } catch (error) {
        log.error(errorCreator('Could not get TrackedEntityType for id')({ TETypeId }));
        return null;
    }

    return TEType.teiRegistration;
};
