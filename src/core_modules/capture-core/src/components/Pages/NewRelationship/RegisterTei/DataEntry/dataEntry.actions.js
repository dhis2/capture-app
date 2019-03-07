// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    DATA_ENTRY_OPEN: 'NewRelationshipRegisterTeiDataEntryOpen',
    DATA_ENTRY_OPEN_CANCELLED: 'NewRelationshopRegisterTeiDataEntryOpenCancelled',
};

export const openDataEntry = () =>
    actionCreator(actionTypes.DATA_ENTRY_OPEN)();

export const openDataEntryCancelled = () =>
    actionCreator(actionTypes.DATA_ENTRY_OPEN_CANCELLED)();
