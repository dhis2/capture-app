// @flow
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import errorCreator from '../../../../../utils/errorCreator';
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
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';
import type { FieldData } from '../../../../../rulesEngineActionsCreator/inputHelpers';

const errorMessages = {
    COULD_NOT_GET_EVENT_FROM_STATE: 'Could not get event from state',
};

export const openEditEventInDataEntryEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(
        editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
        editEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
        editEventActionTypes.START_OPEN_EVENT_FOR_EDIT,
    )
        .map((action) => {
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
        });

export const runRulesForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.ofType(editEventDataEntryBatchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH)
        .map(actionBatch => actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;

            const eventId = state.dataEntries[payload.dataEntryId].eventId;
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
                    payload.formId,
                    orgUnit,
                );
            } else {
                const fieldData: FieldData = {
                    elementId: payload.elementId,
                    value: payload.value,
                    valid: payload.uiState.valid,
                };
                // $FlowFixMe
                const foundation = metadataContainer.stage.stageForm;

                const currentEventValues = getCurrentClientValues(state, foundation, payload.formId, fieldData);

                let currentEventMainData = getCurrentClientMainData(state, payload.itemId, payload.dataEntryId, event, foundation);
                currentEventMainData = { ...currentEventMainData, ...state.events[eventId] };
                const currentEventData = { ...currentEventValues, ...currentEventMainData };

                rulesActions = getRulesActionsForEvent(
                    metadataContainer.program,
                    foundation,
                    payload.formId,
                    orgUnit,
                    currentEventData,
                    [currentEventData],
                );
            }

            return batchActions([
                ...rulesActions,
                rulesExecutedPostUpdateField(payload.dataEntryId, payload.itemId),
            ],
            editEventDataEntryBatchActionTypes.RULES_EFFECTS_ACTIONS_BATCH);
        });

