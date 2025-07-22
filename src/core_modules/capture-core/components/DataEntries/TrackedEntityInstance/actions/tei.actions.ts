import { actionPayloadAppender } from '../../../../actions/actions.utils';

export const startAsyncUpdateFieldForNewTei = (
    innerAction: any,
    onSuccess: (result: any) => void,
    onError: (error: any) => void,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
