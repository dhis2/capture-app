// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { actionCreator, actionPayloadAppender } from '../../../../actions/actions.utils';

export const actionTypes = {
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewEnrollment',
};

export const startRunRulesOnUpdateForNewEnrollment = (
    payload: Object,
    uid: string,
    programId: string,
    orgUnit: OrgUnit,
) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(
        { innerPayload: payload, uid, programId, orgUnit });

export const startAsyncUpdateFieldForNewEnrollment = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
