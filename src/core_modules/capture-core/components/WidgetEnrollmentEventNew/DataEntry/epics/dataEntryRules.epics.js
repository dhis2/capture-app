// @flow
import { ofType } from 'redux-observable';
import { map, concatMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { batchActions } from 'redux-batched-actions';
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
    validateAssignEffects,
    type FieldData,
} from '../../../../rules';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import type { RulesExecutionDependenciesClientFormatted } from '../../common.types';
import { getLocationQuery } from '../../../../utils/routing';
import { getCoreOrgUnitFn, orgUnitFetched } from '../../../../metadataRetrieval/coreOrgUnit';
import type { QuerySingleResource } from '../../../../utils/api';

const runRulesForNewEvent = async ({
    store,
    dataEntryId,
    itemId,
    uid,
    rulesExecutionDependenciesClientFormatted,
    fieldData,
    querySingleResource,
}: {
    store: ReduxStore,
    dataEntryId: string,
    itemId: string,
    uid: string,
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
    const { coreOrgUnit, cached } =
        // $FlowFixMe
        await getCoreOrgUnitFn(querySingleResource)(currentEvent.orgUnit?.id, store.value.organisationUnits);

    const effects = getApplicableRuleEffectsForTrackerProgram({
        program,
        stage,
        orgUnit: coreOrgUnit,
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
        ...(coreOrgUnit && !cached ? [orgUnitFetched(coreOrgUnit)] : []),
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
        concatMap((action) => {
            const { dataEntryId, itemId, uid, rulesExecutionDependenciesClientFormatted } = action.payload;
            const runRulesForNewEventPromise = runRulesForNewEvent({
                store,
                dataEntryId,
                itemId,
                uid,
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
        concatMap((action) => {
            const {
                dataEntryId,
                itemId,
                uid,
                elementId,
                value,
                uiState,
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
                rulesExecutionDependenciesClientFormatted,
                fieldData,
                querySingleResource,
            });
            return from(runRulesForNewEventPromise);
        }));
