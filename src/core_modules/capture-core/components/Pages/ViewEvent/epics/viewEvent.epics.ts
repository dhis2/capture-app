import log from 'loglevel';
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getCoreOrgUnit } from 'capture-core/metadataRetrieval/coreOrgUnit';
import { isSelectionsEqual } from '../../../App/isSelectionsEqual';
import { getErrorMessageAndDetails } from '../../../../utils/errors/getErrorMessageAndDetails';

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
} from '../ViewEventComponent/viewEvent.actions';
import { getEvent } from '../../../../events/eventRequests';
import {
    initializeNewRelationship,
} from '../../NewRelationship/newRelationship.actions';
import { getCategoriesDataFromEventAsync } from './getCategoriesDataFromEvent';
import { eventWorkingListsActionTypes } from '../../../WorkingLists/EventWorkingLists';
import { resetLocationChange } from '../../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';
import { buildUrlQueryString } from '../../../../utils/routing';

export const getEventOpeningFromEventListEpic = (
    action$: any,
    _: any,
    { absoluteApiPath, querySingleResource }: any,
) =>
    action$.pipe(
        ofType(eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN),
        switchMap(({ payload: { eventId } }: any) => getEvent(eventId, absoluteApiPath, querySingleResource)
            .then((eventContainer: any) => {
                if (!eventContainer) {
                    return openViewEventPageFailed(
                        i18n.t('Event could not be loaded. Are you sure it exists?'));
                }
                return getCoreOrgUnit({
                    orgUnitId: eventContainer.event.orgUnitId,
                    onSuccess: (orgUnit: any) => startOpenEventForView(eventContainer, orgUnit),
                    onError: (error: any) => {
                        const { message, details } = getErrorMessageAndDetails(error);
                        log.error(
                            errorCreator(
                                message ||
                                i18n.t('Organisation unit could not be loaded'))(details));
                        return openViewEventPageFailed(
                            i18n.t('Could not get organisation unit'));
                    },
                });
            })
            .catch((error: any) => {
                const { message, details } = getErrorMessageAndDetails(error);
                log.error(
                    errorCreator(
                        message ||
                        i18n.t('Event could not be loaded'))(details));
                return openViewEventPageFailed(
                    i18n.t('Event could not be loaded. Are you sure it exists?'));
            }),
        ),
    );

export const getEventFromUrlEpic = (
    action$: any,
    store: any,
    { absoluteApiPath, querySingleResource }: any,
) =>
    action$.pipe(
        ofType(viewEventActionTypes.VIEW_EVENT_FROM_URL),
        switchMap((action: any) => {
            const eventId = action.payload.eventId;
            const prevProgramId = store.value.currentSelections.programId;
            return getEvent(eventId, absoluteApiPath, querySingleResource)
                .then((eventContainer: any) => {
                    if (!eventContainer) {
                        return eventFromUrlCouldNotBeRetrieved(
                            i18n.t('Event could not be loaded. Are you sure it exists?'));
                    }
                    return getCategoriesDataFromEventAsync(eventContainer.event, querySingleResource)
                        .then((categoriesData: any) => eventFromUrlRetrieved(eventContainer, prevProgramId, categoriesData));
                })
                .catch((error: any) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(
                        errorCreator(
                            message ||
                            i18n.t('Event could not be loaded'))(details));
                    return eventFromUrlCouldNotBeRetrieved(
                        i18n.t('Event could not be loaded. Are you sure it exists?'));
                });
        }));

export const getOrgUnitOnUrlUpdateEpic = (action$: any) =>
    action$.pipe(
        ofType(viewEventActionTypes.EVENT_FROM_URL_RETRIEVED),
        map((action: any) => {
            const eventContainer = action.payload.eventContainer;
            return getCoreOrgUnit({
                orgUnitId: eventContainer.event.orgUnitId,
                onSuccess: (orgUnit: any) => orgUnitRetrievedOnUrlUpdate(orgUnit, eventContainer),
                onError: (error: any) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(errorCreator(
                        message ||
                        i18n.t('Organisation unit could not be loaded'))(details));
                    return orgUnitCouldNotBeRetrievedOnUrlUpdate(eventContainer);
                },
            });
        }));

export const openViewPageLocationChangeEpic = (action$: any, _: any, { navigate }: any) =>
    action$.pipe(
        ofType(eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN),
        map(({ payload: { eventId: viewEventId, orgUnitId } }: any) => {
            navigate(`/viewEvent?${buildUrlQueryString({ viewEventId, orgUnitId })}`);
            return resetLocationChange();
        }));

export const backToMainPageEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE),
        map(() => {
            const state = store.value;

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
        }));

export const backToMainPageLocationChangeEpic = (action$: any, store: any, { navigate }: any) =>
    action$.pipe(
        ofType(viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE),
        switchMap((action: any) => {
            const orgUnitId = action.payload.orgUnitId;
            const state = store.value;
            const programId = state.currentSelections.programId;
            const showaccessible = state.currentSelections.showaccessible;

            if (showaccessible && !orgUnitId) {
                navigate(`/?programId=${programId}&all`);
                return new Promise((resolve) => {
                    setTimeout(() => resolve(resetLocationChange()), 0);
                });
            }
            navigate(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));

export const openAddRelationshipForViewEventEpic = (action$: any) =>
    action$.pipe(
        ofType(viewEventActionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP),
        map(() => initializeNewRelationship()));
