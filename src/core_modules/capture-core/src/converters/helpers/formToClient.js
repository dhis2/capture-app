// @flow
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';

import errorCreator from '../../utils/errorCreator';
import { getTranslation } from '../../d2/d2Instance';
import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { convertValue } from '../formToClient';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

export function convertFormValuesToClient(formValues: ?Object, stage: RenderFoundation) {
    const convertedValues = stage.convertValues(formValues, convertValue);
    return convertedValues;
}

export function convertStateFormValuesToClient(eventId: string, state: Object) {
    const event = ensureState(state.events)[eventId];
    const formValues = state.formsValues[eventId];

    const program = programCollection.get(event.programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ eventId, event }));
        return { error: getTranslation('generic_error'), values: null, stage: null };
    }

    const stage = program.getStage(event.programStageId);
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ eventId, event }));
        return { error: getTranslation('generic_error'), values: null, stage: null };
    }

    const convertedValues = convertFormValuesToClient(formValues, stage);

    return { values: convertedValues, error: null, stage };
}
