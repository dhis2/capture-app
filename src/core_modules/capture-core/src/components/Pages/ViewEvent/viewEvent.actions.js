// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    VIEW_EVENT_FROM_URL: 'ViewEventFromUrl',
    EVENT_FROM_URL_RETRIEVED: 'EventFromUrlRetrievedForViewEvent',
    EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED: 'EventFromUrlCouldNotBeRetrievedForViewEvent',
    ORG_UNIT_RETRIEVED_ON_URL_UPDATE: 'OrgUnitRetrievedForViewEventOnUrlUpdate',
    ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE: 'OrgUnitRetrievalFailedForViewEventOnUrlUpdate',
    START_OPEN_EVENT_FOR_VIEW: 'StartOpenEventForView',
    ADD_EVENT_NOTE: 'AddEventNoteForViewEvent',
    REMOVE_EVENT_NOTE: 'RemoveEventNoteForViewEvent',
    UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE: 'UpdateWorkingListOnBackToMainPageForViewEvent',
    NO_WORKING_LIST_UPDATE_NEEDED_ON_BACK_TO_MAIN_PAGE: 'NoWorkingListUpdateNeededOnBackToMainPageForViewEvent',
    START_GO_BACK_TO_MAIN_PAGE: 'StartGoBackToMainPageForViewEvent',
    VIEW_EVENT_OPEN_NEW_RELATIONSHIP: 'ViewEventOpenAddRelationship',
    UPDATE_EVENT_CONTAINER: 'UpdateEventContainerForViewEvent',
    UPDATE_WORKING_LIST_PENDING_ON_BACK_TO_MAIN_PAGE: 'UpdateWorkingListPendingOnBackToMainPageForViewEvent',
    OPEN_VIEW_EVENT_PAGE_FAILED: 'OpenViewEventPageFailed',
};

export const viewEventFromUrl = (data: Object) =>
    actionCreator(actionTypes.VIEW_EVENT_FROM_URL)({
        eventId: data.nextProps.viewEventId,
        page: data.nextPage,
    });

export const eventFromUrlCouldNotBeRetrieved = (message: string) =>
    actionCreator(actionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED)(message);

export const eventFromUrlRetrieved = (eventContainer: Object, prevProgramId: ?string, categoriesData: ?Object) =>
    actionCreator(actionTypes.EVENT_FROM_URL_RETRIEVED)({ eventContainer, prevProgramId, categoriesData });

export const orgUnitRetrievedOnUrlUpdate = (orgUnit: Object, eventContainer: Object) =>
    actionCreator(actionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE)({ orgUnit, eventContainer });

export const orgUnitCouldNotBeRetrievedOnUrlUpdate = (eventContainer: Object) =>
    actionCreator(actionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE)({ eventContainer });

export const startOpenEventForView = (eventContainer: Object, orgUnit: Object) =>
    actionCreator(actionTypes.START_OPEN_EVENT_FOR_VIEW)({ eventContainer, orgUnit });

export const addEventNote = (eventId: string, note: Object) =>
    actionCreator(actionTypes.ADD_EVENT_NOTE)({ eventId, note });

export const removeEventNote = (eventId: string, noteClientId: string) =>
    actionCreator(actionTypes.REMOVE_EVENT_NOTE)({ eventId, noteClientId });

export const startGoBackToMainPage = () =>
    actionCreator(actionTypes.START_GO_BACK_TO_MAIN_PAGE)();

export const noWorkingListUpdateNeededOnBackToMainPage = () =>
    actionCreator(actionTypes.NO_WORKING_LIST_UPDATE_NEEDED_ON_BACK_TO_MAIN_PAGE)();

export const updateWorkingListOnBackToMainPage = () =>
    actionCreator(actionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE)();

export const updateWorkingListPendingOnBackToMainPage = () =>
    actionCreator(actionTypes.UPDATE_WORKING_LIST_PENDING_ON_BACK_TO_MAIN_PAGE)();

export const openAddRelationship = () =>
    actionCreator(actionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP)();

export const updateEventContainer = (eventContainer: Object, orgUnit: Object) =>
    actionCreator(actionTypes.UPDATE_EVENT_CONTAINER)({ eventContainer, orgUnit });

export const openViewEventPageFailed = (error: string) =>
    actionCreator(actionTypes.OPEN_VIEW_EVENT_PAGE_FAILED)({ error });
