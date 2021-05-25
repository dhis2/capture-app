// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../../metaDataMemoryStores/programCollection/programCollection';


const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
    GENERIC_ERROR: 'An error has occured. See log for details',
};

export function getProgramAndStageForEventProgram(programId: string) {
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        return { error: i18n.t(errorMessages.GENERIC_ERROR), stage: null, program: null };
    }


    // $FlowFixMe[prop-missing] automated comment
    const stage = program.stage;
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ program, programId }));
        return { error: i18n.t(errorMessages.GENERIC_ERROR), stage: null, program: null };
    }

    return { stage, program, error: null };
}
