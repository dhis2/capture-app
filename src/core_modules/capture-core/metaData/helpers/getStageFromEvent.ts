import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';

import { errorCreator } from 'capture-core-utils';
import type { CaptureClientEvent } from 'capture-core-utils';
import { programCollection } from '../../metaDataMemoryStores/programCollection/programCollection';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

export function getStageFromEvent(event: CaptureClientEvent) {
    const eventId = event.eventId;
    const program = programCollection.get(event.programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ eventId, event }));
        return { error: i18n.t('An error has occurred. See log for details'), stage: null };
    }

    const stage = program.getStage(event.programStageId);
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ eventId, event }));
        return { error: i18n.t('An error has occurred. See log for details'), stage: null };
    }

    return { stage, error: null };
}
