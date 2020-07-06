// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
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
    const event = state.events[eventId];
    const formValues = state.formsValues[eventId];

    const program = programCollection.get(event.programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ eventId, event }));
        return { error: i18n.t('An error has occured. See log for details'), values: null, stage: null };
    }

    const stage = program.getStage(event.programStageId);
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ eventId, event }));
        return { error: i18n.t('An error has occured. See log for details'), values: null, stage: null };
    }

    // $FlowFixMe[incompatible-call] automated comment
    const convertedValues = convertFormValuesToClient(formValues, stage);

    return { values: convertedValues, error: null, stage };
}
