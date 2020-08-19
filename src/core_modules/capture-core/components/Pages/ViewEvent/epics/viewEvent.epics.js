// @flow
import log from 'loglevel';
import { push } from 'connected-react-router';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import isSelectionsEqual from '../../../App/isSelectionsEqual';
import getErrorMessageAndDetails from '../../../../utils/errors/getErrorMessageAndDetails';
import getOrganisationUnitApiSpec from '../../../../api/apiSpecifications/organisationUnit.apiSpecificationGetter';
import {
    actionTypes as viewEventActionTypes,
    eventFromUrlCouldNotBeRetrieved,
    eventFromUrlRetrieved,
    orgUnitRetrievedOnUrlUpdate,
    orgUnitCouldNotBeRetrievedOnUrlUpdate,
    startOpenEventForView,
    noWorkingListUpdateNeededOnBackToMainPage,
    updateWorkingListOnBackToMainPage,
    updateWorkingListPendingOnBackToMainPage,
    openViewEventPageFailed,
    initializeWorkingListsOnBackToMainPage,
} from '../viewEvent.actions';
import { listViewActionTypes as eventListActionTypes } from '../../../ListView';
import { getEvent } from '../../../../events/eventRequests';
import {
    initializeNewRelationship,
} from '../../NewRelationship/newRelationship.actions';
import { getCategoriesDataFromEventAsync } from './getCategoriesDataFromEvent';
import { eventWorkingListsActionTypes } from '../../../Pages/MainPage/EventWorkingLists';

export const getEventOpeningFromEventListEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN)
        .switchMap((action) => {
            const state = store.getState();
            const eventId = action.payload;
            return getEvent(eventId)
                .then((eventContainer) => {
                    if (!eventContainer) {
                        return openViewEventPageFailed(
                            i18n.t('Event could not be loaded. Are you sure it exists?'));
                    }
                    const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];
                    return startOpenEventForView(eventContainer, orgUnit);
                })
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(
                        errorCreator(
                            message ||
                            i18n.t('Event could not be loaded'))(details));
                    return openViewEventPageFailed(
                        i18n.t('Event could not be loaded. Are you sure it exists?'));
                });
        });

export const getEventFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(viewEventActionTypes.VIEW_EVENT_FROM_URL)
        .switchMap((action) => {
            const eventId = action.payload.eventId;
            const prevProgramId = store.getState().currentSelections.programId; // used to clear columns and filters in eventlist if program id is changed
            return getEvent(eventId)
                .then((eventContainer) => {
                    if (!eventContainer) {
                        return eventFromUrlCouldNotBeRetrieved(
                            i18n.t('Event could not be loaded. Are you sure it exists?'));
                    }
                    // need to retrieve category names from API (due to 50k category options requirement)
                    return getCategoriesDataFromEventAsync(eventContainer.event)
                        .then(categoriesData => eventFromUrlRetrieved(eventContainer, prevProgramId, categoriesData));
                })
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(
                        errorCreator(
                            message ||
                            i18n.t('Event could not be loaded'))(details));
                    return eventFromUrlCouldNotBeRetrieved(
                        i18n.t('Event could not be loaded. Are you sure it exists?'));
                });
        });

export const getOrgUnitOnUrlUpdateEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(viewEventActionTypes.EVENT_FROM_URL_RETRIEVED)
        .switchMap((action) => {
            const eventContainer = action.payload.eventContainer;
            return getOrganisationUnitApiSpec(eventContainer.event.orgUnitId)
                .get()
                // $FlowSuppress
                .then(orgUnit => orgUnitRetrievedOnUrlUpdate(orgUnit, eventContainer))
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(errorCreator(
                        message ||
                        i18n.t('Organisation unit could not be loaded'))(details));
                    return orgUnitCouldNotBeRetrievedOnUrlUpdate(eventContainer);
                });
        });

export const openViewPageLocationChangeEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN)
        .map(action =>
            push(`/viewEvent/${action.payload}`),
        );

export const backToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE)
        // eslint-disable-next-line complexity
        .map(() => {
            const state = store.getState();

            if (!state.offline.online) {
                return noWorkingListUpdateNeededOnBackToMainPage();
            }
            const listId = state.workingListsTemplates.eventList && state.workingListsTemplates.eventList.currentListId;
            const listSelections = listId && state.workingListsContext[listId];
            if (!listSelections) {
                return initializeWorkingListsOnBackToMainPage();
            }
            const currentSelections = state.currentSelections;
            if (currentSelections.complete && !isSelectionsEqual(listSelections, currentSelections)) {
                return initializeWorkingListsOnBackToMainPage();
            }

            if (state.viewEventPage.eventHasChanged) {
                return updateWorkingListOnBackToMainPage();
            }

            if (state.viewEventPage.saveInProgress) {
                return updateWorkingListPendingOnBackToMainPage();
            }

            return noWorkingListUpdateNeededOnBackToMainPage();
        });

export const backToMainPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            return push(`/programId=${programId}&orgUnitId=${orgUnitId}`);
        });

export const openAddRelationshipForViewEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(viewEventActionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP)
        .map(() => initializeNewRelationship());
