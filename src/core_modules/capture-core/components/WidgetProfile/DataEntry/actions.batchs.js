// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import type { Enrollment, TEIValues } from 'capture-core-utils/rulesEngine';
import { getRulesActionsForTEI } from '../../../rules/actionsCreator';
import { rulesExecutedPostUpdateField } from '../../DataEntry/actions/dataEntry.actions';
import type { TrackerProgram, RenderFoundation } from '../../../metaData';
import { startRunRulesPostUpdateField } from '../../DataEntry';
import { startRunRulesOnUpdateForNewProfile } from './actions';

export const batchActionTypes = {
    RULES_EXECUTED_POST_UPDATE_FIELD_FOR_PROFILE: 'RulesExecutedPostUpdateFieldForProfile',
    UPDATE_FIELD_NEW_PROFILE_ACTION_BATCH: 'UpdateFieldNewProfileActionBatch',
    UPDATE_DATA_ENTRY_FIELD_NEW_PROFILE_ACTION_BATCH: 'UpdateDataEntryFieldNewProfileActionBatch',
};

type Props = {
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    dataEntryId: string,
    itemId: string,
    orgUnit: Object,
    currentEnrollmentValues: ?Enrollment,
    currentTEIValues: ?TEIValues,
    extraActions: Array<ReduxAction<any, any>>,
    uid: string,
};

export const runRulesOnUpdateFieldBatch = ({
    program,
    foundation,
    formId,
    dataEntryId,
    itemId,
    orgUnit,
    currentEnrollmentValues,
    currentTEIValues,
    extraActions = [],
    uid,
}: Props) => {
    let rulesActions = [];
    if (program && foundation) {
        rulesActions = getRulesActionsForTEI(
            program,
            foundation,
            formId,
            orgUnit,
            currentEnrollmentValues,
            currentTEIValues,
        );
    }
    return batchActions(
        [...rulesActions, rulesExecutedPostUpdateField(dataEntryId, itemId, uid), ...extraActions],
        batchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_PROFILE,
    );
};

export const updateDataEntryFieldBatch = (innerAction: ReduxAction<any, any>, program: any, orgUnit: any) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions(
        [
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewProfile(innerAction.payload, uid, orgUnit, program),
        ],
        batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_PROFILE_ACTION_BATCH,
    );
};

export const updateFieldBatch = (innerAction: ReduxAction<any, any>, program: any, orgUnit: any) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions(
        [
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewProfile(innerAction.payload, uid, orgUnit, program),
        ],
        batchActionTypes.UPDATE_FIELD_NEW_PROFILE_ACTION_BATCH,
    );
};
