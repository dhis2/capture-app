// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { getErrorMessageAndDetails } from '../../../../utils/errors/getErrorMessageAndDetails';
import {
    actionTypes as editEventActionTypes,
    eventFromUrlCouldNotBeRetrieved,
    eventFromUrlRetrieved,
} from '../ViewEventComponent/editEvent.actions';
import { getEvent } from '../../../../events/eventRequests';

export const getEventFromUrlEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(editEventActionTypes.EDIT_EVENT_FROM_URL),
        switchMap((action) => {
            const eventId = action.payload.eventId;
            const orgUnit = action.payload.orgUnit;
            const prevProgramId = store.value.currentSelections.programId; // used to clear columns and filters in eventlist if program id is changed
            return getEvent(eventId, absoluteApiPath, querySingleResource)
                .then((eventContainer) => {
                    if (!eventContainer) {
                        return eventFromUrlCouldNotBeRetrieved(
                            i18n.t('Event could not be loaded. Are you sure it exists?'));
                    }
                    return eventFromUrlRetrieved(eventContainer, orgUnit, prevProgramId);
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
