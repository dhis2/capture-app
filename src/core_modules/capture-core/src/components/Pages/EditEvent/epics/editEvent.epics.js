// @flow
import log from 'loglevel';
import errorCreator from '../../../../utils/errorCreator';
import getErrorMessageAndDetails from '../../../../utils/errors/getErrorMessageAndDetails';
import getOrganisationUnitApiSpec from '../../../../api/apiSpecifications/organisationUnit.apiSpecificationGetter';

import { getTranslation } from '../../../../d2/d2Instance';
import { actionTypes as editEventActionTypes, eventFromUrlCouldNotBeRetrieved, eventFromUrlRetrieved, orgUnitRetrievedOnUrlUpdate, orgUnitCouldNotBeRetrievedOnUrlUpdate } from '../editEvent.actions';
import { getEvent } from '../../../../events/eventRequests';

export const getEventFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventActionTypes.EDIT_EVENT_FROM_URL)
        .switchMap((action) => {
            const eventId = action.payload.eventId;
            return getEvent(eventId)
                .then(eventContainer => eventFromUrlRetrieved(eventContainer))
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(errorCreator(message || getTranslation('error_loading_event_from_url_for_edit_event_log_message'))(details));
                    return eventFromUrlCouldNotBeRetrieved(getTranslation('error_loading_event_from_url_for_edit_event_user_message'));
                });
        });

export const getOrgUnitOnUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventActionTypes.EVENT_FROM_URL_RETRIEVED)
        .switchMap((action) => {
            const eventContainer = action.payload;
            return getOrganisationUnitApiSpec(eventContainer.event.orgUnitId)
                .get()
                .then(orgUnit => orgUnitRetrievedOnUrlUpdate(orgUnit, eventContainer))
                .catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(errorCreator(message || getTranslation('error_loading_orgunit_for_url_log_message'))(details));
                    return orgUnitCouldNotBeRetrievedOnUrlUpdate(eventContainer);
                });
        });
