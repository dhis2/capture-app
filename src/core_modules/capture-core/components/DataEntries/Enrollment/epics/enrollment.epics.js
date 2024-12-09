// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActionTypes, runRulesOnUpdateFieldBatch } from '../actions/enrollment.actionBatchs';
import { actionTypes } from '../actions/enrollment.actions';
import { getTrackerProgramThrowIfNotFound, ProgramStage, RenderFoundation, Section } from '../../../../metaData';
import { getCurrentClientMainData, type FieldData } from '../../../../rules';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { convertFormToClient } from '../../../../converters';
import { stageMainDataIds, convertToRulesEngineIds } from '../EnrollmentWithFirstStageDataEntry';

type Context = {
    dataEntryId: string,
    itemId: string,
    uid: string,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
    formFoundation: RenderFoundation,
}

const splitCurrentClientMainData = (stage, currentClientMainData) => {
    if (!stage) {
        return { currentEnrollmentValues: currentClientMainData, currentEventMainData: {} };
    }
    return Object.keys(currentClientMainData).reduce((acc, id) => {
        const stageMainDataId = Object.keys(stageMainDataIds).find(key => stageMainDataIds[key] === id);
        if (stageMainDataId) {
            acc.currentEventMainData = {
                ...acc.currentEventMainData,
                [convertToRulesEngineIds(stageMainDataId)]: currentClientMainData[id],
            };
        } else {
            acc.currentEnrollmentValues = { ...acc.currentEnrollmentValues, [id]: currentClientMainData[id] };
        }
        return acc;
    }, { currentEnrollmentValues: {}, currentEventMainData: {} });
};

const runRulesOnEnrollmentUpdate =
    (store: ReduxStore, context: Context, fieldData?: ?FieldData, searchActions?: any = []) => {
        const state = store.value;
        const { programId, dataEntryId, itemId, orgUnit, uid, stage, formFoundation } = context;
        const formId = getDataEntryKey(dataEntryId, itemId);
        const program = getTrackerProgramThrowIfNotFound(programId);
        const currentFormData = state.formsValues[formId] || {};
        const convertedValues = formFoundation.convertAndGroupBySection(currentFormData, convertFormToClient);
        const attributeValues = convertedValues[Section.groups.ENROLLMENT];
        const currentEventValues = convertedValues[Section.groups.EVENT] || {};
        const currentClientMainData =
            getCurrentClientMainData(state, itemId, dataEntryId, formFoundation) || {};
        const { currentEnrollmentValues, currentEventMainData }
            = splitCurrentClientMainData(state, currentClientMainData);
        const currentEvent = stage
            ? { ...currentEventValues, ...currentEventMainData, programStageId: stage.id } : undefined;

        return runRulesOnUpdateFieldBatch({
            program,
            formId,
            dataEntryId,
            itemId,
            orgUnit,
            enrollmentData: currentEnrollmentValues,
            attributeValues,
            currentEvent,
            extraActions: searchActions,
            uid,
            stage,
            formFoundation: stage ? formFoundation : undefined,
        });
    };


export const runRulesOnEnrollmentDataEntryFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const {
                uid,
                programId,
                orgUnit,
                innerPayload,
                stage,
                formFoundation,
            } = action.payload;

            const {
                dataEntryId,
                itemId,
            } = innerPayload;

            return runRulesOnEnrollmentUpdate(store, {
                dataEntryId,
                itemId,
                uid,
                programId,
                orgUnit,
                stage,
                formFoundation,
            });
        }));

export const runRulesOnEnrollmentFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { innerPayload: payload, searchActions, uid, programId, orgUnit, stage, formFoundation } = action.payload;
            const { dataEntryId, itemId, elementId, value, uiState } = payload;

            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };

            return runRulesOnEnrollmentUpdate(store, {
                programId,
                orgUnit,
                dataEntryId,
                itemId,
                uid,
                stage,
                formFoundation,
            }, fieldData, searchActions);
        }),
    );
