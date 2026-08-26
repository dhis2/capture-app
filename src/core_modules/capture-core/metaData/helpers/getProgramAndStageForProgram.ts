import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../metaDataMemoryStores/programCollection/programCollection';
import { EventProgram } from '../Program';


const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

export function getProgramAndStageForProgram(programId: string, programStageId: string) {
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        return { error: i18n.t('An error has occurred. See log for details'), stage: null, program: null };
    }


    const stage = program instanceof EventProgram ? program.stage : program.getStage(programStageId);

    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ program, programId }));
        return { error: i18n.t('An error has occurred. See log for details'), stage: null, program: null };
    }

    return { stage, program, error: null };
}
