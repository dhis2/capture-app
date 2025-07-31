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
    action$: any,
    store: any,
    { absoluteApiPath, querySingleResource }: any,
) =>
    action$.pipe(
        ofType(editEventActionTypes.EDIT_EVENT_FROM_URL),
        switchMap((action: any) => {
            const eventId = action.payload.eventId;
            const orgUnit = action.payload.orgUnit;
            const prevProgramId = store.value.currentSelections.programId;
            return getEvent(eventId, absoluteApiPath, querySingleResource)
                .then((eventContainer: any) => {
                    if (!eventContainer) {
                        return eventFromUrlCouldNotBeRetrieved(
                            i18n.t('Event could not be loaded. Are you sure it exists?'));
                    }
                    return eventFromUrlRetrieved(eventContainer, orgUnit, prevProgramId);
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
