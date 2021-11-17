// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActionTypes, runRulesOnUpdateFieldBatch } from './actions.batchs';
import { actionTypes } from './actions';
import { TrackerProgram } from '../../../metaData';
import { getCurrentClientValues, getCurrentClientMainData } from '../../../rules/actionsCreator';
import type { FieldData } from '../../../rules/actionsCreator';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';

type Context = {
    dataEntryId: string,
    itemId: string,
    uid: string,
    orgUnit: string,
    program: TrackerProgram,
};

const runRulesOnProfileUpdate = (
    store: ReduxStore,
    context: Context,
    fieldData?: ?FieldData,
    searchActions?: any = [],
) => {
    const state = store.value;
    const { dataEntryId, itemId, orgUnit, uid, program } = context;
    const formId = getDataEntryKey(dataEntryId, itemId);
    const {
        enrollment: { enrollmentForm },
    } = program;
    const currentTEIValues = getCurrentClientValues(state, enrollmentForm, formId, fieldData);
    const currentEnrollmentValues = getCurrentClientMainData(state, itemId, dataEntryId, enrollmentForm);

    return runRulesOnUpdateFieldBatch({
        program,
        foundation: enrollmentForm,
        formId,
        dataEntryId,
        itemId,
        orgUnit,
        currentEnrollmentValues,
        currentTEIValues,
        extraActions: searchActions,
        uid,
    });
};

export const runRulesOnProfileDataEntryFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_PROFILE_ACTION_BATCH),
        map(actionBatch => actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { uid, orgUnit, innerPayload, program } = action.payload;

            const { dataEntryId, itemId } = innerPayload;

            return runRulesOnProfileUpdate(store, {
                dataEntryId,
                itemId,
                uid,
                orgUnit,
                program,
            });
        }),
    );

export const runRulesOnProfileFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_FIELD_NEW_PROFILE_ACTION_BATCH),
        map(actionBatch => actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { innerPayload: payload, searchActions, uid, orgUnit, program } = action.payload;
            const { dataEntryId, itemId, elementId, value, uiState } = payload;

            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };

            return runRulesOnProfileUpdate(
                store,
                {
                    orgUnit,
                    dataEntryId,
                    itemId,
                    uid,
                    program,
                },
                fieldData,
                searchActions,
            );
        }),
    );
