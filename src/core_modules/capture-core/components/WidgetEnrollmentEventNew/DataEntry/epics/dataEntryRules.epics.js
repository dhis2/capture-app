// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import i18n from '@dhis2/d2-i18n';
import { getTrackerProgramThrowIfNotFound } from '../../../../metaData/helpers';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import {
    newEventWidgetDataEntryActionTypes,
    newEventWidgetDataEntryBatchActionTypes,
} from '../actions/dataEntry.actions';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForTrackerProgram,
    updateRulesEffects,
    type FieldData,
} from '../../../../rules';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import type { RulesExecutionDependenciesClientFormatted } from '../../common.types';
import { getLocationQuery } from '../../../../utils/routing';

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
    const { programId, stageId } = getLocationQuery();

    const program = getTrackerProgramThrowIfNotFound(programId);
    const stage = program.getStage(stageId);
    if (!stage) {
        throw Error(i18n.t('Program stage not found'));
    }

    const foundation = stage.stageForm;
    const programStageId = foundation.id;
    const currentEventValues = getCurrentClientValues(state, foundation, formId, fieldData);
    const currentEventMainData = getCurrentClientMainData(state, itemId, dataEntryId, foundation);
    const currentEvent = { ...currentEventValues, ...currentEventMainData, programStageId };

    const ruleEffects = getApplicableRuleEffectsForTrackerProgram({
        program,
        stage,
        orgUnit,
        currentEvent,
        otherEvents: events,
        attributeValues,
        enrollmentData,
    });

    return batchActions([
        updateRulesEffects(ruleEffects, formId),
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
