// @flow

/**
 * Generic action-creator
 * @param type of action
 * @returns {object} FSA-compliant action
 */
export function actionCreator(type: string) {
    return (payload: any, meta: any, error: any) => ({
        type,
        payload,
        meta,
        error,
    });
}
