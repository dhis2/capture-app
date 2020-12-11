// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
  SELECTIONS_NOT_COMPLETE_OPENING_NEW_ENROLLMENT: 'SelectionsNotCompleteOpeningNewEnrollment',
  OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT: 'OpenDataEntryForNewEnrollment',
};

export const selectionsNotCompleteOpeningNewEnrollment = () =>
  actionCreator(actionTypes.SELECTIONS_NOT_COMPLETE_OPENING_NEW_ENROLLMENT)();

export const openDataEntryForNewEnrollment = () =>
  actionCreator(actionTypes.OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT)();
