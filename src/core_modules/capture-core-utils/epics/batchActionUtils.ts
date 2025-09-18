

import isArray from 'd2-utilizr/lib/isArray';


export const filterByInnerAction = (action: any, batchActionType: string, innerActionType?: string) =>
    action.type !== batchActionType || 
    (innerActionType && isArray(action.payload) && action.payload.some(ba => ba.type === innerActionType));

export const mapToInnerAction = (action: any, batchActionType: string, innerActionType?: string) =>
    (action.type === batchActionType && isArray(action.payload) && innerActionType 
        ? action.payload.find(ba => ba.type === innerActionType) 
        : action);
