// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActionTypes, runRulesOnUpdateFieldBatch } from '../actions/enrollment.actionBatchs';
import { actionTypes } from '../actions/enrollment.actions';
import { getTrackerProgramThrowIfNotFound } from '../../../../metaData';
import { getCurrentClientValues, getCurrentClientMainData, type FieldData } from '../../../../rules';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';

type Context = {
    dataEntryId: string,
    itemId: string,
    uid: string,
    programId: string,
    orgUnit: OrgUnit,
}

const runRulesOnEnrollmentUpdate =
    (store: ReduxStore, context: Context, fieldData?: ?FieldData, searchActions?: any = []) => {
        const state = store.value;
        const { programId, dataEntryId, itemId, orgUnit, uid } = context;
        const formId = getDataEntryKey(dataEntryId, itemId);
        const program = getTrackerProgramThrowIfNotFound(programId);
        const foundation = program.enrollment.enrollmentForm;
        const currentTEIValues = getCurrentClientValues(state, foundation, formId, fieldData);
        const currentEnrollmentValues =
            getCurrentClientMainData(state, itemId, dataEntryId, foundation);

        return runRulesOnUpdateFieldBatch(
            program,
            foundation,
            formId,
            dataEntryId,
            itemId,
            orgUnit,
            currentEnrollmentValues,
            currentTEIValues ?? undefined,
            searchActions,
            uid,
        );
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
            });
        }));

export const runRulesOnEnrollmentFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { innerPayload: payload, searchActions, uid, programId, orgUnit } = action.payload;
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
            }, fieldData, searchActions);
        }),
    );
