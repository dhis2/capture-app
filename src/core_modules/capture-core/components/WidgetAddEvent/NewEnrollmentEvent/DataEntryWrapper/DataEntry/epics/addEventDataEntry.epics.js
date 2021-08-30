// @flow
import log from 'loglevel';
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { errorCreator } from 'capture-core-utils';
import { rulesExecutedPostUpdateField } from '../../../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
    cancelOpenNewEventInDataEntry,
    batchActionTypes,
} from '../actions/dataEntry.actions';
import {
    openNewEventInDataEntry,
} from '../actions/dataEntryLoad.actionBatchs';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getRulesActionsForEvent,
} from '../../../../../../rules/actionsCreator';
import { getProgramAndStageForProgram } from '../../../../../../metaData/helpers';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { actionTypes as crossPageActionTypes } from '../../../../../Pages/actions/crossPage.actions';
import { lockedSelectorActionTypes } from '../../../../../LockedSelector/LockedSelector.actions';
import type {
    FieldData,
} from '../../../../../../rules/actionsCreator';

const errorMessages = {
    PROGRAM_OR_STAGE_NOT_FOUND: 'Program or stage not found',
};


export const openAddEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN,
            lockedSelectorActionTypes.PROGRAM_ID_SET,
            lockedSelectorActionTypes.CATEGORY_OPTION_SET,
            crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATE,
        ),
        filter(() => {
            const { app: { page } } = store.value;
            return page === 'enrollmentEventNew';
        }),
        filter((action) => {
            const type = action.type;
            const triggeringActionType = action.payload && action.payload.triggeringActionType;
            if (type === crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATE) {
                return (!!triggeringActionType) && [
                    lockedSelectorActionTypes.ORG_UNIT_ID_SET,
                    lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_VALID,
                ].includes(triggeringActionType);
            }
            return true;
        }),
        map(() => {
            const state = store.value;
            const selectionsComplete = state.currentSelections.complete;
            if (!selectionsComplete) {
                return cancelOpenNewEventInDataEntry();
            }
            const programId = state.currentSelections.programId;
            const programStageId = state.router.location.query.stageId;

            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];
            const metadataContainer = getProgramAndStageForProgram(programId, programStageId);
            if (metadataContainer.error) {
                log.error(
                    errorCreator(
                        errorMessages.PROGRAM_OR_STAGE_NOT_FOUND)(
                        { method: 'openAddEventInDataEntryEpic' }),
                );
            }
            const foundation = metadataContainer.stage && metadataContainer.stage.stageForm;
            return batchActions(

                // $FlowFixMe[incompatible-call] automated comment
                [...openNewEventInDataEntry(metadataContainer.program, foundation, orgUnit)],
                batchActionTypes.OPEN_ADD_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH,
            );
        }));

const runRulesForAddEvent = (store: ReduxStore, dataEntryId: string, itemId: string, uid: string, fieldData?: ?FieldData) => {
    const state = store.value;
    const formId = getDataEntryKey(dataEntryId, itemId);
    const programId = state.currentSelections.programId;
    const stageId = state.router.location.query.stageId;

    const metadataContainer = getProgramAndStageForProgram(programId, stageId);

    const orgUnitId = state.currentSelections.orgUnitId;
    const orgUnit = state.organisationUnits[orgUnitId];

    let rulesActions;
    if (metadataContainer.error) {
        const foundation = metadataContainer.stage ? metadataContainer.stage.stageForm : null;
        rulesActions = getRulesActionsForEvent(
            metadataContainer.program,
            foundation,
            formId,
            orgUnit,
        );
    } else {
        // $FlowFixMe[cannot-resolve-name] automated comment
        const foundation: RenderFoundation = metadataContainer.stage.stageForm;
        const programStageId = foundation.id;
        const currentEventValues = getCurrentClientValues(state, foundation, formId, fieldData);
        const currentEventMainData = getCurrentClientMainData(state, itemId, dataEntryId, foundation);
        const currentEventData = { ...currentEventValues, ...currentEventMainData, programStageId };

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
    batchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
    );
};

export const runRulesOnUpdateDataEntryFieldForAddEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { dataEntryId, itemId, uid } = action.payload;
            return runRulesForAddEvent(store, dataEntryId, itemId, uid);
        }));

export const runRulesOnUpdateFieldForAddEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_FIELD_ADD_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { dataEntryId, itemId, uid, elementId, value, uiState } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForAddEvent(store, dataEntryId, itemId, uid, fieldData);
        }));
