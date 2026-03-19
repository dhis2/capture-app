import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../../metaDataMemoryStores/programCollection/programCollection';
import { EventProgram } from '../../Program';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

export function getStageForEventProgram(programId: string) {
    const program = programCollection.get(programId);
    if (!program || !(program instanceof EventProgram)) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        return { error: i18n.t('An error has occurred. See log for details'), stage: null };
    }


    const stage = program.stage;
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ programId }));
        return { error: i18n.t('An error has occurred. See log for details'), stage: null };
    }

    return { stage, error: null };
}
