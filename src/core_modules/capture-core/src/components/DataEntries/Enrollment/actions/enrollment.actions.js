// @flow
import { actionCreator, actionPayloadAppender } from '../../../../actions/actions.utils';

export const actionTypes = {
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewEnrollment',
};

export const startRunRulesOnUpdateForNewEnrollment = (
    payload: Object,
    searchActions: any,
    uid: string,
    programId: string,
    orgUnitId: string,
) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(
        { innerPayload: payload, searchActions, uid, programId, orgUnitId }, { skipLogging: ['searchActions'] });

export const startAsyncUpdateFieldForNewEnrollment = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
