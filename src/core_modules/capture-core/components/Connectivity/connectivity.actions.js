// @flow
import { actionCreator } from '../../actions/actions.utils';

export const batchActionTypes = {
  GOING_ONLINE_EXECUTED_BATCH: 'GoingOnlineExecutedBatch',
};

export const actionTypes = {
  GOING_ONLINE_EXECUTED: 'GoingOnlineExecuted',
  GET_EVENT_LIST_ON_RECONNECT: 'GetEventListOnReconnect',
};

export const goingOnlineExecuted = () => actionCreator(actionTypes.GOING_ONLINE_EXECUTED)();

export const getEventListOnReconnect = () =>
  actionCreator(actionTypes.GET_EVENT_LIST_ON_RECONNECT)();
