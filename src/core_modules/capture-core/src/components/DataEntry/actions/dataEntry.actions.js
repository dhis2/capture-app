// @flow
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';
import { batchActions } from 'redux-batched-actions';

import metaDataCollection from '../../../metaData/programCollection/programCollection';
import { valueConvertersForType } from '../../../converters/clientToForm';
import errorCreator from '../../../utils/errorCreator';
import { actionCreator } from '../../../actions/actions.utils';
import { addFormData } from '../../D2Form/actions/form.actions';

export const actionTypes = {
    LOAD_DATA_ENTRY_EVENT: 'LoadDataEntryEvent',
    LOAD_DATA_ENTRY_EVENT_FAILED: 'LoadDataEntryEventFailed',
    START_COMPLETE_EVENT: 'StartCompleteDataEntryEvent',
    COMPLETE_EVENT: 'CompleteDataEntryEvent',
    COMPLETE_EVENT_ERROR: 'CompleteDataEntryEventError',
    COMPLETE_VALIDATION_FAILED: 'CompleteValidationFailedForDataEntry',
    START_SAVE_EVENT: 'StartSaveDataEntryEvent',
    SAVE_EVENT: 'SaveDataEntryEvent',
    SAVE_EVENT_ERROR: 'SaveDataEntryEventError',
    SAVE_VALIDATION_FALED: 'SaveValidationFailedForDataEntry',
};

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

export function loadDataEntryEvent(eventId: string, state: ReduxState, id?: ?string = 'main') {
    const event: Event = ensureState(state.events)[eventId];
    const eventValues = ensureState(state.eventsValues)[eventId];

    const program = metaDataCollection.get(event.programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ action: 'openDataEntry', event }));
        return actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT_FAILED)();
    }

    const stage = program.getStage(event.programStageId);
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ action: 'openDataEntry', event }));
        return actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT_FAILED)();
    }

    const convertedValues = stage.convertValues(eventValues, valueConvertersForType);

    return batchActions([
        actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT)({ eventId, id }),
        addFormData(eventId, convertedValues),
    ]);
}

// COMPLETE
export const startCompleteEvent = (eventId: string, id: string) => actionCreator(actionTypes.START_COMPLETE_EVENT)({ eventId, id });

export const completeEventError = (error: string, id: string) => actionCreator(actionTypes.COMPLETE_EVENT_ERROR)({ error, id });

export const completeEvent =
    (clientValues: ?Object, serverValues: ?Object, eventId: string, event: ?Object, id: string) =>
        actionCreator(actionTypes.COMPLETE_EVENT)({
            clientValues,
            eventId,
            event: { ...event, status: 'COMPLETED' },
            requestInfo: {
                data: serverValues,
                endpoint: `events/${eventId}`,
                method: 'POST',
            },
            id,
        },
        {
            isOptimistic: true,
        });

export const completeValidationFailed =
    (eventId: string, id: string) => actionCreator(actionTypes.COMPLETE_VALIDATION_FAILED)({ eventId, id });

// SAVE
export const startSaveEvent = (eventId: string, id: string) => actionCreator(actionTypes.START_SAVE_EVENT)({ eventId, id });

export const saveEventError = (error: string, id: string) => actionCreator(actionTypes.SAVE_EVENT_ERROR)({ error, id });

export const saveEvent =
    (clientValues: ?Object, serverValues: ?Object, eventId: string, event: ?Object, id: string) =>
        actionCreator(actionTypes.SAVE_EVENT)({
            clientValues,
            eventId,
            event,
            requestInfo: {
                data: serverValues,
                endpoint: `events/${eventId}`,
                method: 'POST',
            },
            id,
        },
        {
            isOptimistic: true,
        });

export const saveValidationFailed =
    (eventId: string, id: string) => actionCreator(actionTypes.SAVE_VALIDATION_FALED)({ eventId, id });
