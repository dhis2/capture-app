// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    EDIT_EVENT_FROM_URL: 'EditEventFromUrl',
    EVENT_FROM_URL_RETRIEVED: 'EventFromUrlRetrievedForEditEvent',
    EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED: 'EventFromUrlCouldNotBeRetrievedForEditEvent',
    ORG_UNIT_RETRIEVED_ON_URL_UPDATE: 'OrgUnitRetrievedForEditEventOnUrlUpdate',
    ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE: 'OrgUnitRetrievalFailedForEditEventOnUrlUpdate',
    START_OPEN_EVENT_FOR_EDIT: 'StartOpenEventForEditInDataEntry',
};

export const editEventFromUrl = (data: Object) =>
    actionCreator(actionTypes.EDIT_EVENT_FROM_URL)({
        eventId: data.nextProps.eventId,
        page: data.nextPage,
    });

export const eventFromUrlCouldNotBeRetrieved = (message: string) =>
    actionCreator(actionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED)(message);

export const eventFromUrlRetrieved = (eventContainer: Object) =>
    actionCreator(actionTypes.EVENT_FROM_URL_RETRIEVED)(eventContainer);

export const orgUnitRetrievedOnUrlUpdate = (orgUnit: Object, eventContainer: Object) =>
    actionCreator(actionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE)({ orgUnit, eventContainer });

export const orgUnitCouldNotBeRetrievedOnUrlUpdate = (eventContainer: Object) =>
    actionCreator(actionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE)({ eventContainer });

export const startOpenEventForEditInDataEntry = (eventContainer: Object, orgUnit: Object) =>
    actionCreator(actionTypes.START_OPEN_EVENT_FOR_EDIT)({ eventContainer, orgUnit });
