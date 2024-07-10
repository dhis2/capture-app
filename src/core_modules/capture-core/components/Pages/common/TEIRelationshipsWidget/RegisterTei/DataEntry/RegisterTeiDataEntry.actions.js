// @flow
import { actionCreator } from '../../../../../../actions/actions.utils';

export const actionTypes = {
    DATA_ENTRY_OPEN: 'RelationshipsWidget.NewRelationshipRegisterTeiDataEntryOpen',
    DATA_ENTRY_OPEN_CANCELLED: 'RelationshipsWidget.NewRelationshopRegisterTeiDataEntryOpenCancelled',
    DATA_ENTRY_OPEN_FAILED: 'RelationshipsWidget.NewRelationshopRegisterTeiDataEntryOpenFailed',
};

export const openDataEntry = () =>
    actionCreator(actionTypes.DATA_ENTRY_OPEN)();

export const openDataEntryFailed = (errorMessage: string) =>
    actionCreator(actionTypes.DATA_ENTRY_OPEN_FAILED)({ errorMessage });
