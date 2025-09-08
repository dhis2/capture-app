import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { actionCreator, actionPayloadAppender } from '../../../../actions/actions.utils';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import type { ReduxAction } from '../../../../../capture-core-utils/types';

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
    payload: any;
    uid: string;
    programId: string;
    orgUnit: OrgUnit;
    stage?: ProgramStage;
    formFoundation: RenderFoundation;
    onGetValidationContext: () => any;
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
    onSuccess: (successInnerAction: ReduxAction<any, any>) => void,
    onError: (errorInnerAction: ReduxAction<any, any>) => void,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
