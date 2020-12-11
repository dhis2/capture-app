// @flow
import log from 'loglevel';
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import { push } from 'connected-react-router';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getApi } from '../../../../d2';
import isSelectionsEqual from '../../../App/isSelectionsEqual';
import getErrorMessageAndDetails from '../../../../utils/errors/getErrorMessageAndDetails';

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
import { initializeNewRelationship } from '../../NewRelationship/newRelationship.actions';
import { getCategoriesDataFromEventAsync } from './getCategoriesDataFromEvent';
import { eventWorkingListsActionTypes } from '../../MainPage/EventWorkingLists';

export const getEventOpeningFromEventListEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN),
    switchMap((action) => {
      const state = store.value;
      const eventId = action.payload;
      return getEvent(eventId)
        .then((eventContainer) => {
          if (!eventContainer) {
            return openViewEventPageFailed(
              i18n.t('Event could not be loaded. Are you sure it exists?'),
            );
          }
          const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];
          return startOpenEventForView(eventContainer, orgUnit);
        })
        .catch((error) => {
          const { message, details } = getErrorMessageAndDetails(error);
          log.error(errorCreator(message || i18n.t('Event could not be loaded'))(details));
          return openViewEventPageFailed(
            i18n.t('Event could not be loaded. Are you sure it exists?'),
          );
        });
    }),
  );

export const getEventFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(viewEventActionTypes.VIEW_EVENT_FROM_URL),
    switchMap((action) => {
      const { eventId } = action.payload;
      const prevProgramId = store.value.currentSelections.programId; // used to clear columns and filters in eventlist if program id is changed
      return getEvent(eventId)
        .then((eventContainer) => {
          if (!eventContainer) {
            return eventFromUrlCouldNotBeRetrieved(
              i18n.t('Event could not be loaded. Are you sure it exists?'),
            );
          }
          // need to retrieve category names from API (due to 50k category options requirement)
          return getCategoriesDataFromEventAsync(eventContainer.event).then((categoriesData) =>
            eventFromUrlRetrieved(eventContainer, prevProgramId, categoriesData),
          );
        })
        .catch((error) => {
          const { message, details } = getErrorMessageAndDetails(error);
          log.error(errorCreator(message || i18n.t('Event could not be loaded'))(details));
          return eventFromUrlCouldNotBeRetrieved(
            i18n.t('Event could not be loaded. Are you sure it exists?'),
          );
        });
    }),
  );

export const getOrgUnitOnUrlUpdateEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(viewEventActionTypes.EVENT_FROM_URL_RETRIEVED),
    switchMap((action) => {
      const { eventContainer } = action.payload;
      return getApi()
        .get(`organisationUnits/${eventContainer.event.orgUnitId}`)
        .then((orgUnit) => orgUnitRetrievedOnUrlUpdate(orgUnit, eventContainer))
        .catch((error) => {
          const { message, details } = getErrorMessageAndDetails(error);
          log.error(
            errorCreator(message || i18n.t('Organisation unit could not be loaded'))(details),
          );
          return orgUnitCouldNotBeRetrievedOnUrlUpdate(eventContainer);
        });
    }),
  );

export const openViewPageLocationChangeEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN),
    map((action) => push(`/viewEvent/${action.payload}`)),
  );

export const backToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE),
    // eslint-disable-next-line complexity
    map(() => {
      const state = store.value;

      if (!state.offline.online) {
        return noWorkingListUpdateNeededOnBackToMainPage();
      }
      const listId =
        state.workingListsTemplates.eventList &&
        state.workingListsTemplates.eventList.currentListId;
      const listSelections = listId && state.workingListsContext[listId];
      if (!listSelections) {
        return initializeWorkingListsOnBackToMainPage();
      }
      const { currentSelections } = state;
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
    }),
  );

export const backToMainPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE),
    map(() => {
      const state = store.value;
      const { programId } = state.currentSelections;
      const { orgUnitId } = state.currentSelections;
      return push(`/programId=${programId}&orgUnitId=${orgUnitId}`);
    }),
  );

export const openAddRelationshipForViewEventEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(viewEventActionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP),
    map(() => initializeNewRelationship()),
  );
