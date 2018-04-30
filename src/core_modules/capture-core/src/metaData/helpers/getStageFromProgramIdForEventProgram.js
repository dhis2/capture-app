// @flow
import log from 'loglevel';

import errorCreator from '../../utils/errorCreator';
import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import { getTranslation } from '../../d2/d2Instance';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

export default function getStageForEventProgram(programId: string) {
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        return { error: getTranslation('generic_error'), stage: null };
    }

    // $FlowSuppress
    const stage = program.getStage();
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ programId }));
        return { error: getTranslation('generic_error'), stage: null };
    }

    return { stage, error: null };
}
