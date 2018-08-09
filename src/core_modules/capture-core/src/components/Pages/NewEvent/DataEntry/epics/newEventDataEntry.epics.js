// @flow
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import { rulesExecutedPostUpdateField } from '../../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../../EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../../MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
    batchActionTypes as newEventDataEntryBatchActionTypes,
    openNewEventInDataEntry,
    selectionsNotCompleteOpeningNewEvent,
    batchActionTypes,
} from '../newEventDataEntry.actions';
import {
    getRulesActionsForEvent,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import {
    actionTypes as newEventSelectionTypes,
} from '../../newEventSelections.actions';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorInputHelpers';
import getProgramAndStageFromProgramId from
    '../../../../../metaData/helpers/EventProgram/getProgramAndStageFromProgramId';
import errorCreator from '../../../../../utils/errorCreator';
import {
    resetList,
} from '../../../../List/list.actions';
import type {
    FieldData,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import {
    listId,
} from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';

const errorMessages = {
    PROGRAM_OR_STAGE_NOT_FOUND: 'Program or stage not found',
};

export const openNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        editEventSelectorActionTypes.OPEN_NEW_EVENT,
        mainPageSelectorActionTypes.OPEN_NEW_EVENT,
        newEventSelectionTypes.VALID_SELECTIONS_FROM_URL,
        newEventDataEntryBatchActionTypes.SAVE_NEW_EVENT_ADD_ANOTHER_BATCH)
        .map(() => {
            const state = store.getState();
            const selectionsComplete = state.currentSelections.complete;
            if (!selectionsComplete) {
                return selectionsNotCompleteOpeningNewEvent();
            }
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];
            const metadataContainer = getProgramAndStageFromProgramId(programId);
            if (metadataContainer.error) {
                log.error(
                    errorCreator(
                        errorMessages.PROGRAM_OR_STAGE_NOT_FOUND)(
                        { method: 'openNewEventInDataEntryEpic' }),
                );
            }

            return batchActions(
                // $FlowSuppress
                [...openNewEventInDataEntry(metadataContainer.program, metadataContainer.stage, orgUnit),

                ],
                batchActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH,
            );
        });

export const resetRecentlyAddedEventsWhenNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.ofType(
        editEventSelectorActionTypes.OPEN_NEW_EVENT,
        mainPageSelectorActionTypes.OPEN_NEW_EVENT,
        newEventSelectionTypes.VALID_SELECTIONS_FROM_URL)
        .map(() => {
            const state = store.getState();
            const newEventsListColumnsOrder = state.workingListsColumnsOrder.main || [];
            const newEventsMeta = { sortById: 'created', sortByDirection: 'desc' };
            return resetList(listId, newEventsListColumnsOrder, newEventsMeta, state.currentSelections);
        });

export const runRulesForSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH)
        .map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const metadataContainer = getProgramAndStageFromProgramId(programId);

            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];

            const payload = action.payload;
            const fieldData: FieldData = {
                elementId: payload.elementId,
                value: payload.value,
                valid: payload.uiState.valid,
            };

            let rulesActions;
            if (metadataContainer.error) {
                rulesActions = getRulesActionsForEvent(
                    metadataContainer.program,
                    metadataContainer.stage,
                    payload.formId,
                    orgUnit,
                );
            } else {
                // $FlowSuppress
                const foundation: RenderFoundation = metadataContainer.stage;

                const currentEventValues = getCurrentClientValues(state, foundation, payload.formId, fieldData);
                const currentEventMainData = getCurrentClientMainData(state, payload.itemId, payload.dataEntryId, {});
                const currentEventData = { ...currentEventValues, ...currentEventMainData };

                rulesActions = getRulesActionsForEvent(
                    metadataContainer.program,
                    metadataContainer.stage,
                    payload.formId,
                    orgUnit,
                    currentEventData,
                );
            }

            return batchActions([
                ...rulesActions,
                rulesExecutedPostUpdateField(payload.dataEntryId, payload.itemId),
            ],
            batchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
            );
        });
