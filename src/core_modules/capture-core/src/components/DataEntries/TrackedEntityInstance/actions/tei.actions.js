// @flow
import { actionPayloadAppender } from '../../../../actions/actions.utils';

export const startAsyncUpdateFieldForNewTei = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
