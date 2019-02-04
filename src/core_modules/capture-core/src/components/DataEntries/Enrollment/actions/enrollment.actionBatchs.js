// @flow
import { batchActions } from 'redux-batched-actions';
import type {
    Enrollment,
    TEIValues,
} from 'capture-core-utils/RulesEngine/rulesEngine.types';
import { getRulesActionsForTEI } from '../../../../rulesEngineActionsCreator';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import { TrackerProgram, RenderFoundation } from '../../../../metaData';

export const batchActionTypes = {
    RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT: 'RulesExecutedPostUpdateFieldForEnrollment',
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
        ...extraActions,
    ], batchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT);
};
