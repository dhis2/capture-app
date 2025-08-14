import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../../metaDataMemoryStores/programCollection/programCollection';
import { EventProgram } from '../../Program';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
    GENERIC_ERROR: 'An error has occured. See log for details',
};

export function getStageForEventProgram(programId: string) {
    const program = programCollection.get(programId);
    if (!program || !(program instanceof EventProgram)) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        return { error: i18n.t(errorMessages.GENERIC_ERROR), stage: null };
    }


    const stage = program.stage;
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ programId }));
        return { error: i18n.t(errorMessages.GENERIC_ERROR), stage: null };
    }

    return { stage, error: null };
}
