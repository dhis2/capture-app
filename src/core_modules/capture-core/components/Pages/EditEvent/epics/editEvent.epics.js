// @flow
import log from 'loglevel';
import { push } from 'connected-react-router';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import getErrorMessageAndDetails from '../../../../utils/errors/getErrorMessageAndDetails';
import getOrganisationUnitApiSpec from '../../../../api/apiSpecifications/organisationUnit.apiSpecificationGetter';
import {
    actionTypes as editEventActionTypes,
    eventFromUrlCouldNotBeRetrieved,
    eventFromUrlRetrieved,
    orgUnitRetrievedOnUrlUpdate,
    orgUnitCouldNotBeRetrievedOnUrlUpdate,
    startOpenEventForEditInDataEntry,
} from '../editEvent.actions';
import { actionTypes as eventListActionTypes } from '../../../ListView/listView.actions';
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

export const getEventFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventActionTypes.EDIT_EVENT_FROM_URL)
        .switchMap((action) => {
            const eventId = action.payload.eventId;
            const prevProgramId = store.getState().currentSelections.programId; // used to clear columns and filters in eventlist if program id is changed
            return getEvent(eventId)
                .then((eventContainer) => {
                    if (!eventContainer) {
                        return eventFromUrlCouldNotBeRetrieved(
                            i18n.t('Event could not be loaded. Are you sure it exists?'));
                    }
                    return eventFromUrlRetrieved(eventContainer, prevProgramId);
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

export const openEditPageLocationChangeEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(eventListActionTypes.OPEN_EDIT_EVENT_PAGE)
        .map(action =>
            push(`/editEvent/${action.payload}`),
        );
