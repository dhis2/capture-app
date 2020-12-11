// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { rulesExecutedPostUpdateField } from '../../../../DataEntry/actions/dataEntry.actions';
import { actionTypes as editEventActionTypes } from '../../editEvent.actions';
import {
  openEventForEditInDataEntry,
  prerequisitesErrorOpeningEventForEditInDataEntry,
  batchActionTypes as editEventDataEntryBatchActionTypes,
  actionTypes as editEventDataEntryActionTypes,
} from '../editEventDataEntry.actions';
import {
  getProgramAndStageFromEvent,
  getEventProgramThrowIfNotFound,
} from '../../../../../metaData';
import {
  getRulesActionsForEvent,
  getCurrentClientValues,
  getCurrentClientMainData,
} from '../../../../../rules/actionsCreator';
import type { FieldData } from '../../../../../rules/actionsCreator';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';

export const openEditEventInDataEntryEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(
      editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
      editEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
      editEventActionTypes.START_OPEN_EVENT_FOR_EDIT,
    ),
    map((action) => {
      const { eventContainer } = action.payload;
      const { orgUnit } = action.payload;

      const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
      if (metadataContainer.error) {
        return prerequisitesErrorOpeningEventForEditInDataEntry(metadataContainer.error);
      }
      const foundation = metadataContainer.stage.stageForm;
      const { program } = metadataContainer;

      return batchActions(
        openEventForEditInDataEntry(eventContainer, orgUnit, foundation, program),
      );
    }),
  );

const runRulesForEditSingleEvent = (
  store: ReduxStore,
  dataEntryId: string,
  itemId: string,
  uid: string,
  fieldData?: ?FieldData,
) => {
  const state = store.value;
  const formId = getDataEntryKey(dataEntryId, itemId);
  const { eventId } = state.dataEntries[dataEntryId];
  const { programId } = state.currentSelections;
  const eventProgram = getEventProgramThrowIfNotFound(programId);

  const { orgUnitId } = state.currentSelections;
  const orgUnit = state.organisationUnits[orgUnitId];

  const foundation = eventProgram.stage.stageForm;

  const currentEventValues = getCurrentClientValues(state, foundation, formId, fieldData);

  let currentEventMainData = getCurrentClientMainData(state, itemId, dataEntryId, foundation);
  currentEventMainData = {
    ...state.events[eventId],
    ...currentEventMainData,
  };
  const currentEventData = { ...currentEventValues, ...currentEventMainData };

  const rulesActions = getRulesActionsForEvent(
    eventProgram,
    foundation,
    formId,
    orgUnit,
    currentEventData,
    [currentEventData],
  );

  return batchActions(
    [...rulesActions, rulesExecutedPostUpdateField(dataEntryId, itemId, uid)],
    editEventDataEntryBatchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
  );
};

export const runRulesOnUpdateDataEntryFieldForEditSingleEventEpic = (
  action$: InputObservable,
  store: ReduxStore,
) =>
  // $FlowSuppress
  action$.pipe(
    ofType(
      editEventDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH,
    ),
    map((actionBatch) =>
      actionBatch.payload.find(
        (action) => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE,
      ),
    ),
    map((action) => {
      const { dataEntryId, itemId, uid } = action.payload;
      return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid);
    }),
  );

export const runRulesOnUpdateFieldForEditSingleEventEpic = (
  action$: InputObservable,
  store: ReduxStore,
) =>
  // $FlowSuppress
  action$.pipe(
    ofType(editEventDataEntryBatchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
    map((actionBatch) =>
      actionBatch.payload.find(
        (action) => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE,
      ),
    ),
    map((action) => {
      const { elementId, value, uiState, dataEntryId, itemId, uid } = action.payload;
      const fieldData: FieldData = {
        elementId,
        value,
        valid: uiState.valid,
      };
      return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid, fieldData);
    }),
  );
