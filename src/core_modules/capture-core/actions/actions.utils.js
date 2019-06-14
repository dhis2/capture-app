// @flow
/**
 * @module actionUtils
 */

/**
 * Generic action-creator
 * @param  {string} type - type of the action
 * @returns {function} a function accepting payload, meta and error -> returning an FSA-compliant action
 */
export function actionCreator(type: string) {
    return (payload: any, meta: any, error: any) => ({
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
