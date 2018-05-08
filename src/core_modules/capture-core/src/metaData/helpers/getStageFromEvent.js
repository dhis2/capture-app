// @flow
import log from 'loglevel';

import errorCreator from '../../utils/errorCreator';
import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import { getTranslation } from '../../d2/d2Instance';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

export default function getStageFromEvent(event: Event) {
    const eventId = event.eventId;
    const program = programCollection.get(event.programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ eventId, event }));
        return { error: getTranslation('generic_error'), stage: null };
    }

    const stage = program.getStage(event.programStageId);
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ eventId, event }));
        return { error: getTranslation('generic_error'), stage: null };
    }

    return { stage, error: null };
}
