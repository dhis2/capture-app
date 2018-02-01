// @flow

import { BEGIN, COMMIT, REVERT } from 'redux-optimistic-ui';
import sendRequest from './__TEMP__/sendRequest';
import { actionCreator } from '../../actions/actions.utils';

const SUCCESS = '_RequestSuccess';
const ERROR = '_RequestError';

// Each optimistic item will need a transaction Id to internally match the BEGIN to the COMMIT/REVERT
let nextTransactionID = 0;

export default store => next => (action) => {
    const { type, meta, payload } = action;

    // For actions that have a high probability of failing, don't set the flag
    if (!meta || !meta.isOptimistic) return next(action);

    nextTransactionID += 1;
    const transactionID = nextTransactionID;

    // Extend the action.meta to let it know we're beginning an optimistic update
    next({
        ...action,
        meta: {
            optimistic: {
                type: BEGIN, id: transactionID,
            },
        },
    });

    // send request
    sendRequest(action.requestInfo)
        .then((result) => {
            const successAction = actionCreator(type + SUCCESS)(payload, {
                optimistic: {
                    type: COMMIT,
                    id: transactionID,
                },
            });
            next(successAction);
        })
        .catch((error) => {
            const errorAction = actionCreator(type + ERROR)(payload, {
                optimistic: {
                    type: REVERT,
                    id: transactionID,
                },
            },
            error);
            next(errorAction);
        });
};
