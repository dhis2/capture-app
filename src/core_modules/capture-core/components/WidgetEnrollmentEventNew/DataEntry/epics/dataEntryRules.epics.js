// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { getProgramAndStageForProgram } from '../../../../metaData/helpers';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import {
    newEventWidgetDataEntryActionTypes,
    newEventWidgetDataEntryBatchActionTypes,
} from '../actions/dataEntry.actions';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getRulesActionsForEvent,
    getRulesActionsForEnrollmentEvent,
} from '../../../../rules/actionsCreator';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import type {
    FieldData,
} from '../../../../rules/actionsCreator';
import type { OrgUnit, RulesExecutionDependenciesClientFormatted } from '../../common.types';
import { deriveURLParamsFromHistory } from '../../../../utils/routing';

const runRulesForNewEvent = (
    store: ReduxStore,
    dataEntryId: string,
    itemId: string,
    uid: string,
    orgUnit: OrgUnit,
    history: Object,
    { events, attributeValues, enrollmentData }: RulesExecutionDependenciesClientFormatted,
    fieldData?: ?FieldData,
) => {
    const state = store.value;
    const formId = getDataEntryKey(dataEntryId, itemId);
    const { programId, stageId } = deriveURLParamsFromHistory(history);

    const metadataContainer = getProgramAndStageForProgram(programId, stageId);

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

        rulesActions = getRulesActionsForEnrollmentEvent({
            // $FlowFixMe
            program: metadataContainer.program,
            foundation,
            formId,
            orgUnit,
            currentEvent: currentEventData,
            // $FlowFixMe
            eventsData: events,
            attributeValues,
            // $FlowFixMe
            enrollmentData,
        });
    }

    return batchActions([
        ...rulesActions,
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
    ],
    newEventWidgetDataEntryBatchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
    );
};

export const runRulesOnUpdateDataEntryFieldForNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload
                .find(action => action.type === newEventWidgetDataEntryActionTypes.RULES_ON_UPDATE_EXECUTE)),
        map((action) => {
            const { dataEntryId, itemId, uid, orgUnit, rulesExecutionDependenciesClientFormatted } = action.payload;
            return runRulesForNewEvent(
                store,
                dataEntryId,
                itemId,
                uid,
                orgUnit,
                history,
                rulesExecutionDependenciesClientFormatted,
            );
        }));

export const runRulesOnUpdateFieldForNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryBatchActionTypes.FIELD_UPDATE_BATCH),
        map(actionBatch =>
            actionBatch.payload
                .find(action => action.type === newEventWidgetDataEntryActionTypes.RULES_ON_UPDATE_EXECUTE)),
        map((action) => {
            const {
                dataEntryId,
                itemId,
                uid,
                elementId,
                value,
                uiState,
                orgUnit,
                rulesExecutionDependenciesClientFormatted,
            } = action.payload;

            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForNewEvent(
                store,
                dataEntryId,
                itemId,
                uid,
                orgUnit,
                history,
                rulesExecutionDependenciesClientFormatted,
                fieldData,
            );
        }));
