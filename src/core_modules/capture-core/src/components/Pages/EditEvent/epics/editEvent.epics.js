// @flow
import log from 'loglevel';
import { replace } from 'react-router-redux';
import errorCreator from '../../../../utils/errorCreator';
import getErrorMessageAndDetails from '../../../../utils/errors/getErrorMessageAndDetails';
import getOrganisationUnitApiSpec from '../../../../api/apiSpecifications/organisationUnit.apiSpecificationGetter';

import { getTranslation } from '../../../../d2/d2Instance';
import {
    actionTypes as editEventActionTypes,
    eventFromUrlCouldNotBeRetrieved,
    eventFromUrlRetrieved,
    orgUnitRetrievedOnUrlUpdate,
    orgUnitCouldNotBeRetrievedOnUrlUpdate,
    startOpenEventForEditInDataEntry,
} from '../editEvent.actions';
import { actionTypes as eventListActionTypes } from '../../MainPage/EventsList/eventsList.actions';
import { getEvent } from '../../../../events/eventRequests';

export const getEventOpeningFromEventListEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(eventListActionTypes.OPEN_EDIT_EVENT_PAGE)
        .map((action) => {
            const eventId = action.payload;
            const state = store.getState();
            const event = state.events[eventId];
            const values = state.eventsValues[eventId];
            const eventContainer = {
                event,
                values,
                id: event.eventId,
            };

            const orgUnit = state.organisationUnits[event.orgUnitId];
            return startOpenEventForEditInDataEntry(eventContainer, orgUnit);
        });

export const getEventFromUrlEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(editEventActionTypes.EDIT_EVENT_FROM_URL)
        .switchMap((action) => {
            const eventId = action.payload.eventId;
            return getEvent(eventId)
                .then((eventContainer) => {
                    if (!eventContainer) {
                        return eventFromUrlCouldNotBeRetrieved(
                            getTranslation('error_loading_event_from_url_for_edit_event_user_message'));
                    }
                    return eventFromUrlRetrieved(eventContainer);
                })
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(
                        errorCreator(
                            message ||
                            getTranslation('error_loading_event_from_url_for_edit_event_log_message'))(details));
                    return eventFromUrlCouldNotBeRetrieved(
                        getTranslation('error_loading_event_from_url_for_edit_event_user_message'));
                });
        });

export const getOrgUnitOnUrlUpdateEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(editEventActionTypes.EVENT_FROM_URL_RETRIEVED)
        .switchMap((action) => {
            const eventContainer = action.payload;
            return getOrganisationUnitApiSpec(eventContainer.event.orgUnitId)
                .get()
                // $FlowSuppress
                .then(orgUnit => orgUnitRetrievedOnUrlUpdate(orgUnit, eventContainer))
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(errorCreator(
                        message ||
                        getTranslation('error_loading_orgunit_for_url_log_message'))(details));
                    return orgUnitCouldNotBeRetrievedOnUrlUpdate(eventContainer);
                });
        });

export const openEditPageLocationChangeEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(eventListActionTypes.OPEN_EDIT_EVENT_PAGE)
        .map(action =>
            replace(`/editEvent/${action.payload}`),
        );
