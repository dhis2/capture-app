import { actionCreator } from 'capture-core/actions/actions.utils';

type OrgUnit = any;

export const actionTypes = {
    EDIT_EVENT_FROM_URL: 'EditEventFromUrl',
    EVENT_FROM_URL_RETRIEVED: 'EventFromUrlRetrievedForEditEvent',
    EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED: 'EventFromUrlCouldNotBeRetrievedForEditEvent',
    ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE: 'OrgUnitRetrievalFailedForEditEventOnUrlUpdate',
    ADD_EVENT_NOTE: 'AddEventNote',
    REMOVE_EVENT_NOTE: 'RemoveEventNote',
};

export const eventFromUrlCouldNotBeRetrieved = (message: string) =>
    actionCreator(actionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED)(message);

export const eventFromUrlRetrieved = (eventContainer: any, orgUnit: OrgUnit, prevProgramId?: string) =>
    actionCreator(actionTypes.EVENT_FROM_URL_RETRIEVED)({ eventContainer, orgUnit, prevProgramId });

export const orgUnitCouldNotBeRetrievedOnUrlUpdate = (eventContainer: any) =>
    actionCreator(actionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE)({ eventContainer });

export const addEventNote = (eventId: string, note: any) =>
    actionCreator(actionTypes.ADD_EVENT_NOTE)({ eventId, note });

export const removeEventNote = (eventId: string, noteClientId: string) =>
    actionCreator(actionTypes.REMOVE_EVENT_NOTE)({ eventId, noteClientId });
