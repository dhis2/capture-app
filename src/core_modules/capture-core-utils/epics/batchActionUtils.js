// @flow
import isArray from 'd2-utilizr/lib/isArray';

export const filterByInnerAction = (
  action: Object,
  batchActionType: string,
  innerActionType: string,
) =>
  action.type !== batchActionType ||
  (isArray(action.payload) && action.payload.some((ba) => ba.type === innerActionType));

export const mapToInnerAction = (
  action: Object,
  batchActionType: string,
  innerActionType: string,
) =>
  action.type === batchActionType && isArray(action.payload)
    ? action.payload.find((ba) => ba.type === innerActionType)
    : action;
