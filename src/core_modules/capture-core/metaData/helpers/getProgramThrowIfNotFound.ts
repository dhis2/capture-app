import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../metaDataMemoryStores';
import { EventProgram, TrackerProgram } from '../Program';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
};

export function getProgramThrowIfNotFound(programId: string): EventProgram | TrackerProgram {
    const program = programCollection.get(programId);

    if (!program || !(program instanceof TrackerProgram || program instanceof EventProgram)) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        throw new Error(i18n.t('An error has occurred. See log for details'));
    }

    return program;
}
