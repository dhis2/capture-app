// @flow
import { batchActions } from 'redux-batched-actions';
import type {
    Enrollment,
    TEIValues,
} from 'capture-core-utils/RulesEngine/rulesEngine.types';
import { getRulesActionsForTEI } from '../../../../../rulesEngineActionsCreator';
import { startRunRulesOnUpdateForNewEnrollment } from './dataEntry.actions';
import { rulesExecutedPostUpdateField } from '../../../../DataEntry/actions/dataEntry.actions';
import { TrackerProgram, RenderFoundation } from '../../../../../metaData';

export const batchActionTypes = {
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'updateFieldNewEnrollmentActionBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsUpdateFieldNewEnrollmentActionBatch',
};

export const updateFieldBatch = (innerAction: ReduxAction<any, any>) =>
    batchActions([
        innerAction,
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);

export const runRulesOnUpdateFieldBatch = (
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    dataEntryId: string,
    itemId: string,
    orgUnit: Object,
    enrollment: ?Enrollment,
    teiValues: ?TEIValues,
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
        rulesExecutedPostUpdateField(dataEntryId, itemId),
    ],
    batchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
    );
};
