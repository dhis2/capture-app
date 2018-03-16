// @flow
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';
import { batchActions } from 'redux-batched-actions';

import metaDataCollection from '../../../metaDataMemoryStores/programCollection/programCollection';
import DataElement from '../../../metaData/DataElement/DataElement';
import { convertValue } from '../../../converters/clientToForm';
import errorCreator from '../../../utils/errorCreator';
import { actionCreator } from '../../../actions/actions.utils';
import { addFormData } from '../../D2Form/actions/form.actions';

import { getRulesActionsOnLoad } from '../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

export const actionTypes = {
    START_LOAD_DATA_ENTRY_EVENT: 'StartLoadDataEntryEvent',
    OPEN_DATA_ENTRY_EVENT_ALREADY_LOADED: 'OpenDataEntryEventAlreadyLoaded',
    LOAD_DATA_ENTRY_EVENT: 'LoadDataEntryEvent',
    LOAD_DATA_ENTRY_EVENT_FAILED: 'LoadDataEntryEventFailed',
    START_COMPLETE_EVENT: 'StartCompleteDataEntryEvent',
    COMPLETE_EVENT: 'CompleteDataEntryEvent',
    COMPLETE_EVENT_ERROR: 'CompleteDataEntryEventError',
    COMPLETE_VALIDATION_FAILED: 'CompleteValidationFailedForDataEntry',
    COMPLETE_ABORT: 'CompleteAbortedForDataEntry',
    START_SAVE_EVENT: 'StartSaveDataEntryEvent',
    SAVE_EVENT: 'SaveDataEntryEvent',
    SAVE_EVENT_ERROR: 'SaveDataEntryEventError',
    SAVE_VALIDATION_FALED: 'SaveValidationFailedForDataEntry',
    SAVE_ABORT: 'SaveAbortedForDataEntry',
    UPDATE_FIELD: 'UpdateDataEntryField',
    UPDATE_FORM_FIELD: 'UpdateDataEntryFormField',
};

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

type EventPropToInclude = {
    id: string,
    type: string,
};

export const startLoadDataEntryEvent =
    (eventId: string, eventPropsToInclude?: ?Array<EventPropToInclude>, dataEntryId?: ?string = 'main') =>
        actionCreator(actionTypes.START_LOAD_DATA_ENTRY_EVENT)({ eventId, eventPropsToInclude, dataEntryId });

export function loadDataEntryEvent(
    eventId: string,
    state: ReduxState,
    eventPropsToInclude?: ?Array<EventPropToInclude>,
    id: string) {
    const event: Event = ensureState(state.events)[eventId];
    const eventValues = ensureState(state.eventsValues)[eventId];

    const program = metaDataCollection.get(event.programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ action: 'openDataEntry', event }));
        return actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT_FAILED)();
    }

    // $FlowSuppress TODO: TEI
    const stage = program.getStage(event.programStageId);
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ action: 'openDataEntry', event }));
        return actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT_FAILED)();
    }

    const convertedValues = stage.convertValues(eventValues, convertValue);

    // eventPropsToInclude
    let dataEntryValues;
    let dataEntryTypes;
    if (eventPropsToInclude) {
        dataEntryValues = eventPropsToInclude
            .map(propToInclude => new DataElement((_this) => {
                _this.id = propToInclude.id;
                _this.type = propToInclude.type;
            }))
            .reduce((accConvertedEventProps, dataElement: DataElement) => {
                accConvertedEventProps[dataElement.id] = dataElement.convertValue(event[dataElement.id], convertValue);
                return accConvertedEventProps;
            }, {});

        dataEntryTypes = eventPropsToInclude.reduce((accTypes, prop: EventPropToInclude) => {
            accTypes[prop.id] = prop.type;
            return accTypes;
        }, {});
    }

    return batchActions([
        actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT)({ eventId, id, dataEntryValues, dataEntryTypes }),
        addFormData(eventId, convertedValues),
        ...getRulesActionsOnLoad(eventId, state, eventId, id),
    ]);
}

export const openDataEntryEventAlreadyLoaded =
    (eventId: string, dataEntryId: string) =>
        actionCreator(actionTypes.OPEN_DATA_ENTRY_EVENT_ALREADY_LOADED)({ eventId, dataEntryId });

// COMPLETE
export const startCompleteEvent =
    (eventId: string, id: string) => actionCreator(actionTypes.START_COMPLETE_EVENT)({ eventId, id });

export const completeEventError =
    (error: string, id: string) => actionCreator(actionTypes.COMPLETE_EVENT_ERROR)({ error, id });

export const completeEvent =
    (clientValues: ?Object, serverData: Object, event: Object, eventId: string, id: string) =>
        actionCreator(actionTypes.COMPLETE_EVENT)({
            clientValues,
            eventId,
            event: { ...event, status: 'COMPLETED' },
            requestInfo: {
                data: serverData,
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

export const completeAbort =
    (eventId: string, id: string) => actionCreator(actionTypes.COMPLETE_ABORT)({ eventId, id });

// SAVE
export const startSaveEvent =
    (eventId: string, id: string) => actionCreator(actionTypes.START_SAVE_EVENT)({ eventId, id });

export const saveEventError = (error: string, id: string) => actionCreator(actionTypes.SAVE_EVENT_ERROR)({ error, id });

export const saveEvent =
    (clientValues: ?Object, serverData: Object, event: Object, eventId: string, id: string) =>
        actionCreator(actionTypes.SAVE_EVENT)({
            clientValues,
            eventId,
            event,
            requestInfo: {
                data: serverData,
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

export const saveAbort =
    (eventId: string, id: string) => actionCreator(actionTypes.SAVE_ABORT)({ eventId, id });

export const updateField =
    (value: any, valueMeta: Object, fieldId: string, dataEntryId: string, eventId: string) =>
        actionCreator(actionTypes.UPDATE_FIELD)({ value, valueMeta, fieldId, dataEntryId, eventId });

export const updateFormField =
    (
        value: any,
        uiState: Object,
        elementId: string,
        sectionId: string,
        formId: string,
        dataEntryId: string,
        eventId: string,
    ) =>
        actionCreator(
            actionTypes.UPDATE_FORM_FIELD)({ value, uiState, formId, sectionId, elementId, dataEntryId, eventId });
