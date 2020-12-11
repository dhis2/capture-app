// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
  DATA_ENTRY_NEW_TEI_OPEN: 'OpenDataEntryForNewTEI',
};

export const openDataEntryForNewTei = (dataEntryId: string, generatedUniqueValues: Object) =>
  actionCreator(actionTypes.DATA_ENTRY_NEW_TEI_OPEN)({
    dataEntryId,
    generatedUniqueValues,
  });
