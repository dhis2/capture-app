import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { getErrorMessageAndDetails } from '../../../../utils/errors/getErrorMessageAndDetails';
import { getTermLabel } from '../../../../metaData';
import { tCustomTerm } from '../../../../utils/tCustomTerm';
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
            const eventLabel = getTermLabel('event', { programId: prevProgramId });
            return getEvent(eventId, absoluteApiPath, querySingleResource)
                .then((eventContainer: any) => {
                    if (!eventContainer) {
                        return eventFromUrlCouldNotBeRetrieved(
                            tCustomTerm('{{eventLabel}} could not be loaded. Are you sure it exists?', { eventLabel }));
                    }
                    return eventFromUrlRetrieved(eventContainer, orgUnit, prevProgramId);
                })
                .catch((error: any) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(
                        errorCreator(
                            message ||
                            tCustomTerm('{{eventLabel}} could not be loaded', { eventLabel }))(details));
                    return eventFromUrlCouldNotBeRetrieved(
                        tCustomTerm('{{eventLabel}} could not be loaded. Are you sure it exists?', { eventLabel }));
                });
        }));
