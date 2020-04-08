// @flow
import log from 'loglevel';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { errorCreator } from 'capture-core-utils';
import { rulesExecutedPostUpdateField } from '../../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as editEventActionTypes,
} from '../../editEvent.actions';
import {
    openEventForEditInDataEntry,
    prerequisitesErrorOpeningEventForEditInDataEntry,
    batchActionTypes as editEventDataEntryBatchActionTypes,
    actionTypes as editEventDataEntryActionTypes,
} from '../editEventDataEntry.actions';
import { getProgramAndStageFromEvent } from '../../../../../metaData';
import { getRulesActionsForEvent } from '../../../../../rulesEngineActionsCreator';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
} from '../../../../../rulesEngineActionsCreator/inputHelpers';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import type
{ FieldData } from '../../../../../rulesEngineActionsCreator/inputHelpers';


const errorMessages = {
    COULD_NOT_GET_EVENT_FROM_STATE: 'Could not get event from state',
};

export const openEditEventInDataEntryEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.pipe(
        ofType(
            editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            editEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            editEventActionTypes.START_OPEN_EVENT_FOR_EDIT,
        ),
        map((action) => {
            const eventContainer = action.payload.eventContainer;
            const orgUnit = action.payload.orgUnit;

            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorOpeningEventForEditInDataEntry(metadataContainer.error);
            }
            // $FlowFixMe
            const foundation = metadataContainer.stage.stageForm;
            const program = metadataContainer.program;

            // $FlowSuppress
            return batchActions(openEventForEditInDataEntry(eventContainer, orgUnit, foundation, program));
        }));


const runRulesForEditSingleEvent = (store: ReduxStore, dataEntryId: string, itemId: string, uid: string, fieldData?: ?FieldData) => {
    const state = store.getState();
    const formId = getDataEntryKey(dataEntryId, itemId);
    const eventId = state.dataEntries[dataEntryId].eventId;
    const event = state.events[eventId];
    const metadataContainer = getProgramAndStageFromEvent(event);

    const orgUnitId = state.currentSelections.orgUnitId;
    const orgUnit = state.organisationUnits[orgUnitId];

    let rulesActions;
    if (metadataContainer.error) {
        const foundation = metadataContainer.stage ? metadataContainer.stage.stageForm : null;
        log.error(
            errorCreator(
                errorMessages.COULD_NOT_GET_EVENT_FROM_STATE)(
                { method: 'runRulesForEditSingleEventEpic' }));
        rulesActions = getRulesActionsForEvent(
            metadataContainer.program,
            foundation,
            formId,
            orgUnit,
        );
    } else {
        // $FlowFixMe
        const foundation = metadataContainer.stage.stageForm;

        const currentEventValues = getCurrentClientValues(state, foundation, formId, fieldData);

        let currentEventMainData = getCurrentClientMainData(state, itemId, dataEntryId, event, foundation);
        currentEventMainData = { ...state.events[eventId], ...currentEventMainData };
        const currentEventData = { ...currentEventValues, ...currentEventMainData };

        rulesActions = getRulesActionsForEvent(
            metadataContainer.program,
            foundation,
            formId,
            orgUnit,
            currentEventData,
            [currentEventData],
        );
    }

    return batchActions([
        ...rulesActions,
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
    ],
    editEventDataEntryBatchActionTypes.RULES_EFFECTS_ACTIONS_BATCH);
};

export const runRulesOnUpdateDataEntryFieldForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(editEventDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch => actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { dataEntryId, itemId, uid } = action.payload;
            return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid);
        }));

export const runRulesOnUpdateFieldForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(editEventDataEntryBatchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch => actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { elementId, value, uiState, dataEntryId, itemId, uid } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid, fieldData);
        }));

