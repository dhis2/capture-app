import { actionCreator } from 'capture-core/actions/actions.utils';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';

export const actionTypes = {
    EDIT_EVENT_FROM_URL: 'EditEventFromUrl',
    EVENT_FROM_URL_RETRIEVED: 'EventFromUrlRetrievedForEditEvent',
    EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED: 'EventFromUrlCouldNotBeRetrievedForEditEvent',
    ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE: 'OrgUnitRetrievalFailedForEditEventOnUrlUpdate',
};

export const eventFromUrlCouldNotBeRetrieved = (message: string) =>
    actionCreator(actionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED)(message);

export const eventFromUrlRetrieved = (eventContainer: any, orgUnit: OrgUnit, prevProgramId: string | null | undefined) =>
    actionCreator(actionTypes.EVENT_FROM_URL_RETRIEVED)({ eventContainer, orgUnit, prevProgramId });

export const orgUnitCouldNotBeRetrievedOnUrlUpdate = (eventContainer: any) =>
    actionCreator(actionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE)({ eventContainer });
