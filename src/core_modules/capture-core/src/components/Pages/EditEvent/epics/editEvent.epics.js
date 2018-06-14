// @flow
import log from 'loglevel';
import { replace } from 'react-router-redux';
import errorCreator from '../../../../utils/errorCreator';
import getErrorMessageAndDetails from '../../../../utils/errors/getErrorMessageAndDetails';
import getOrganisationUnitApiSpec from '../../../../api/apiSpecifications/organisationUnit.apiSpecificationGetter';

import i18n from '@dhis2/d2-i18n';
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
            const state = store.getState();
            const event = state.events[action.payload];
            const values = state.eventsValues[action.payload];
            const eventContainer = {
                event,
                values,
                id: event.eventId,
            };

            // TODO: GET ORGUNIT FROM STATE
            return startOpenEventForEditInDataEntry(eventContainer, {
                id: 'Rp268JB6Ne4',
                name: 'Adonkia CHP',
            });
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
                            i18n.t('Event could not be loaded. Are you sure it exists?'));
                    }
                    return eventFromUrlRetrieved(eventContainer);
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
                        i18n.t('Organisation unit could not be loaded'))(details));
                    return orgUnitCouldNotBeRetrievedOnUrlUpdate(eventContainer);
                });
        });

export const openEditPageLocationChangeEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(eventListActionTypes.OPEN_EDIT_EVENT_PAGE)
        .map(action =>
            replace(`/editEvent/${action.payload}`),
        );
