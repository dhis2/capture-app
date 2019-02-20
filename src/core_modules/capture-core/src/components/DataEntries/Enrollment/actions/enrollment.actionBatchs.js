// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import type {
    Enrollment,
    TEIValues,
} from 'capture-core-utils/RulesEngine/rulesEngine.types';
import { getRulesActionsForTEI } from '../../../../rulesEngineActionsCreator';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import { TrackerProgram, RenderFoundation } from '../../../../metaData';
import { startRunRulesPostUpdateField } from '../../../DataEntry';
import { startRunRulesOnUpdateForNewEnrollment } from './enrollment.actions';

export const batchActionTypes = {
    RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT: 'RulesExecutedPostUpdateFieldForEnrollment',
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
};

export const runRulesOnUpdateFieldBatch = (
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    dataEntryId: string,
    itemId: string,
    orgUnit: Object,
    enrollment: ?Enrollment,
    teiValues: ?TEIValues,
    extraActions: Array<ReduxAction<any, any>> = [],
    uid: string,
) => {
    let rulesActions = [];
    if (program && foundation) {
        rulesActions = getRulesActionsForTEI(
            program,
            foundation,
            formId,
            orgUnit,
            enrollment,
            teiValues,
        );
    }

    return batchActions([
        ...rulesActions,
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
        ...extraActions,
    ], batchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT);
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
    extraActions: {
        filterActions: Array<ReduxAction<any, any>>,
        filterActionsToBeExecuted: Array<ReduxAction<any, any>>
    },
    programId: string,
    orgUnitId: string,
) => {
    const { filterActions, filterActionsToBeExecuted } = extraActions;
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        ...filterActionsToBeExecuted,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, filterActions, uid, programId, orgUnitId),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
    extraActions: {
        filterActions: Array<ReduxAction<any, any>>,
        filterActionsToBeExecuted: Array<ReduxAction<any, any>>,
    },
    dataEntryId: string,
    itemId: string,
    programId: string,
    orgUnitId: string,
) => {
    const { filterActions, filterActionsToBeExecuted } = extraActions;
    const uid = uuid();

    return batchActions([
        innerAction,
        ...filterActionsToBeExecuted,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment({ ...innerAction.payload, dataEntryId, itemId }, filterActions, uid, programId, orgUnitId),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};
