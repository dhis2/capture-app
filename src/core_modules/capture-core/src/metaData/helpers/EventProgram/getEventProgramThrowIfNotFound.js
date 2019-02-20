// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../../metaDataMemoryStores';
import { EventProgram } from '../../Program';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found or program not an event program',
    GENERIC_ERROR: 'An error has occured. See log for details',
};

export default function getEventProgramThrowIfNotFound(programId: string): EventProgram {
    const program = programCollection.get(programId);
    if (!program || !(program instanceof EventProgram)) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        throw Error(i18n.t(errorMessages.GENERIC_ERROR));
    }
    return program;
}
