import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    EVENT_DELETE: 'EventWorkingListsEventListEventDelete',
    EVENT_DELETE_SUCCESS: 'EventWorkingListsEventListEventDeleteSuccess',
    EVENT_DELETE_ERROR: 'EventWorkingListsEventListEventDeleteError',
    VIEW_EVENT_PAGE_OPEN: 'ViewEventPageOpen',
    EVENT_REQUEST_DELETE: 'EventWorkingListsEventDelete',
};

export const deleteEventSuccess =
    (eventId: string, storeId: string) => actionCreator(actionTypes.EVENT_DELETE_SUCCESS)({ eventId, storeId });

export const deleteEventError =
    (programId: string) => actionCreator(actionTypes.EVENT_DELETE_ERROR)(null, { programId });

export const openViewEventPage = (eventId: string, contextOrgUnitId: string | null | undefined) =>
    actionCreator(actionTypes.VIEW_EVENT_PAGE_OPEN)({ eventId, orgUnitId: contextOrgUnitId });

export const requestDeleteEvent = (eventId: string, storeId: string, programId: string) =>
    actionCreator(actionTypes.EVENT_REQUEST_DELETE)({ eventId, storeId, programId });
