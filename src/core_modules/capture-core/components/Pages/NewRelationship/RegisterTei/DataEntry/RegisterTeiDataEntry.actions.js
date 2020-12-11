// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
  DATA_ENTRY_OPEN: 'NewRelationshipRegisterTeiDataEntryOpen',
  DATA_ENTRY_OPEN_CANCELLED: 'NewRelationshopRegisterTeiDataEntryOpenCancelled',
  DATA_ENTRY_OPEN_FAILED: 'NewRelationshopRegisterTeiDataEntryOpenFailed',
};

export const openDataEntry = () => actionCreator(actionTypes.DATA_ENTRY_OPEN)();

export const openDataEntryFailed = (errorMessage: string) =>
  actionCreator(actionTypes.DATA_ENTRY_OPEN_FAILED)({ errorMessage });
