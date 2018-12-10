// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    OPEN_TEI_SEARCH: 'OpenTeiSearch',
};

export const batchActionTypes = {
    BATCH_OPEN_TEI_SEARCH: 'BatchOpenTeiSearch',
};

export const openTeiSearch = (trackedEntityTypeId: string, programId: ?string) =>
    actionCreator(actionTypes.OPEN_TEI_SEARCH)({ trackedEntityTypeId, programId });
