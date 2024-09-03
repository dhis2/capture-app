// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { actionCreator, actionPayloadAppender } from '../../../../actions/actions.utils';
import { ProgramStage, RenderFoundation } from '../../../../metaData';

export const actionTypes = {
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewEnrollment',
};

export const startRunRulesOnUpdateForNewEnrollment = ({
    payload,
    uid,
    programId,
    orgUnit,
    stage,
    formFoundation,
    onGetValidationContext,
}: {
    payload: Object,
    uid: string,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
    formFoundation: RenderFoundation,
    onGetValidationContext: () => Object,
}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)({
        innerPayload: payload,
        uid,
        programId,
        orgUnit,
        stage,
        formFoundation,
        onGetValidationContext,
    });

export const startAsyncUpdateFieldForNewEnrollment = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
