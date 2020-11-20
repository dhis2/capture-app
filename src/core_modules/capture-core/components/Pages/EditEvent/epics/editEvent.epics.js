// @flow
import log from 'loglevel';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import getErrorMessageAndDetails from '../../../../utils/errors/getErrorMessageAndDetails';
import { getApi } from '../../../../d2';
import {
    actionTypes as editEventActionTypes,
    eventFromUrlCouldNotBeRetrieved,
    eventFromUrlRetrieved,
    orgUnitRetrievedOnUrlUpdate,
    orgUnitCouldNotBeRetrievedOnUrlUpdate,
} from '../editEvent.actions';
import { getEvent } from '../../../../events/eventRequests';

export const getEventFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(editEventActionTypes.EDIT_EVENT_FROM_URL),
        switchMap((action) => {
            const eventId = action.payload.eventId;
            const prevProgramId = store.value.currentSelections.programId; // used to clear columns and filters in eventlist if program id is changed
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
        }));

export const getOrgUnitOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(editEventActionTypes.EVENT_FROM_URL_RETRIEVED),
        switchMap((action) => {
            const eventContainer = action.payload.eventContainer;
            return getApi().get(`organisationUnits/${eventContainer.event.orgUnitId}`)
                .then(orgUnit => orgUnitRetrievedOnUrlUpdate(orgUnit, eventContainer))
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(errorCreator(
                        message ||
                        i18n.t('Organisation unit could not be loaded'))(details));
                    return orgUnitCouldNotBeRetrievedOnUrlUpdate(eventContainer);
                });
        }));
