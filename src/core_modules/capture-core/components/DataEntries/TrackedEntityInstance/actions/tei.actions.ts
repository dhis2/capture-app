import type { ReduxAction } from 'capture-core-utils/types';
import { actionPayloadAppender } from '../../../../actions/actions.utils';

export const startAsyncUpdateFieldForNewTei = (
    innerAction: ReduxAction<any, any>,
    onSuccess: (result: any) => void,
    onError: (error: any) => void,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
