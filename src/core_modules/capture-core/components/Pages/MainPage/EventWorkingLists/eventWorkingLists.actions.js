// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
  EVENT_DELETE: 'EventWorkingListsEventListEventDelete',
  EVENT_DELETE_SUCCESS: 'EventWorkingListsEventListEventDeleteSuccess',
  EVENT_DELETE_ERROR: 'EventWorkingListsEventListEventDeleteError',
  VIEW_EVENT_PAGE_OPEN: 'ViewEventPageOpen',
  EVENT_REQUEST_DELETE: 'EventWorkingListsEventDelete',
};

export const deleteEventSuccess = (eventId: string, storeId: string) =>
  actionCreator(actionTypes.EVENT_DELETE_SUCCESS)({ eventId, storeId });

export const deleteEventError = () => actionCreator(actionTypes.EVENT_DELETE_ERROR)();

export const openViewEventPage = (eventId: string) =>
  actionCreator(actionTypes.VIEW_EVENT_PAGE_OPEN)(eventId);

export const requestDeleteEvent = (eventId: string, storeId: string) =>
  actionCreator(actionTypes.EVENT_REQUEST_DELETE)({ eventId, storeId });
