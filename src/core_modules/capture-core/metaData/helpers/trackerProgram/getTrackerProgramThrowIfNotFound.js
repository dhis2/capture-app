// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../Program';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    PROGRAM_NOT_FOUND_DISPLAY: i18n.t('Program not found'),
    NOT_TRACKER_PROGRAM: 'Program is not a tracker program',
    NOT_TRACKER_PROGRAM_DISPLAY: i18n.t('Program is not a tracker program'),
};

export function getTrackerProgramThrowIfNotFound(programId: string): TrackerProgram {
    const program = programCollection.get(programId);

    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        throw Error(errorMessages.PROGRAM_NOT_FOUND_DISPLAY);
    }

    if (!(program instanceof TrackerProgram)) {
        log.error(errorCreator(errorMessages.NOT_TRACKER_PROGRAM)({ programId }));
        throw Error(errorMessages.NOT_TRACKER_PROGRAM_DISPLAY);
    }

    return program;
}
