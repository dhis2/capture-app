// @flow
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
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
import { validateAssignEffects } from '../../../D2Form';
import type { QuerySingleResource } from '../../../../utils/api';

const runRulesForNewEvent = async ({
    store,
    dataEntryId,
    itemId,
    uid,
    orgUnit,
    rulesExecutionDependenciesClientFormatted,
    fieldData,
    querySingleResource,
}: {
    store: ReduxStore,
    dataEntryId: string,
    itemId: string,
    uid: string,
    orgUnit: OrgUnit,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
    fieldData?: ?FieldData,
    querySingleResource: QuerySingleResource,
}) => {
    const { events, attributeValues, enrollmentData } = rulesExecutionDependenciesClientFormatted;
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

    const effects = getApplicableRuleEffectsForTrackerProgram({
        program,
        stage,
        orgUnit,
        currentEvent,
        otherEvents: events,
        attributeValues,
        enrollmentData,
    });

    const effectsWithValidations = await validateAssignEffects({
        dataElements: foundation.getElements(),
        effects,
        querySingleResource,
    });

    return batchActions([
        updateRulesEffects(effectsWithValidations, formId),
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
    ],
    newEventWidgetDataEntryBatchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
    );
};

export const runRulesOnUpdateDataEntryFieldForNewEnrollmentEventEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload
                .find(action => action.type === newEventWidgetDataEntryActionTypes.RULES_ON_UPDATE_EXECUTE)),
        switchMap((action) => {
            const { dataEntryId, itemId, uid, orgUnit, rulesExecutionDependenciesClientFormatted } = action.payload;
            const runRulesForNewEventPromise = runRulesForNewEvent({
                store,
                dataEntryId,
                itemId,
                uid,
                orgUnit,
                rulesExecutionDependenciesClientFormatted,
                querySingleResource,
            });
            return from(runRulesForNewEventPromise);
        }));

export const runRulesOnUpdateFieldForNewEnrollmentEventEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryBatchActionTypes.FIELD_UPDATE_BATCH),
        map(actionBatch =>
            actionBatch.payload
                .find(action => action.type === newEventWidgetDataEntryActionTypes.RULES_ON_UPDATE_EXECUTE)),
        switchMap((action) => {
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

            const runRulesForNewEventPromise = runRulesForNewEvent({
                store,
                dataEntryId,
                itemId,
                uid,
                orgUnit,
                rulesExecutionDependenciesClientFormatted,
                fieldData,
                querySingleResource,
            });
            return from(runRulesForNewEventPromise);
        }));
