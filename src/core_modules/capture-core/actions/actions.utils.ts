/**
 * @module actionUtils
 */

type ActionCreator = (payload?: any, meta?: any, error?: any) => {
    type: string;
    payload?: any;
    meta?: any;
    error?: any;
};

/**
 * Generic action-creator
 * @param  {string} type - type of the action
 * @returns {function} a function accepting payload, meta and error -> returning an FSA-compliant action
 */
export function actionCreator(type: string): ActionCreator {
    return (payload?: any, meta?: any, error?: any) => ({
        type,
        payload,
        meta,
        error,
    });
}

export function actionPayloadAppender(action: ReduxAction<Object, any>) {
    return (payload: Object) => ({
        ...action,
        payload: {
            ...action.payload,
            ...payload,
        },
    });
}
