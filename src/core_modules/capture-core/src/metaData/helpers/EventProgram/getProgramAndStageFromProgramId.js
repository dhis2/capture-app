// @flow
import log from 'loglevel';

import errorCreator from '../../../utils/errorCreator';
import programCollection from '../../../metaDataMemoryStores/programCollection/programCollection';
import i18n from '@dhis2/d2-i18n';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
    GENERIC_ERROR: 'An error has occured. See log for details'
};

export default function getProgramAndStageFromProgramId(programId: string) {   
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        return { error: i18n.t(errorMessages.GENERIC_ERROR), stage: null, program: null };
    }

    const stage = program.getStage();
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ program, programId }));
        return { error: i18n.t(errorMessages.GENERIC_ERROR), stage: null, program: null };
    }

    return { stage, program, error: null };
}
