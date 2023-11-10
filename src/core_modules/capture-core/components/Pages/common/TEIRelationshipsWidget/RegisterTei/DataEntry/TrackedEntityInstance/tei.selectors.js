// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { TrackedEntityType } from '../../../../../../../metaData';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../../../../metaData';

// $FlowFixMe
export const getTeiRegistrationMetadata = (TETypeId: string) => {
    let TEType: TrackedEntityType;
    try {
        TEType = getTrackedEntityTypeThrowIfNotFound(TETypeId);
    } catch (error) {
        log.error(errorCreator('Could not get TrackedEntityType for id')({ TETypeId }));
        return null;
    }

    return TEType.teiRegistration;
};
