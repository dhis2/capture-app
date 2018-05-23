// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    OPEN_NEW_EVENT_PAGE: 'OpenNewEventPage',
};

export const openNewEventPage =
    (programId: string, orgUnitId: string) =>
        actionCreator(actionTypes.OPEN_NEW_EVENT_PAGE)({ programId, orgUnitId });
