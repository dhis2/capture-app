// @flow
export default (state: ReduxState) => {
  const formValues = state.formsValues['singleEvent-newEvent'] || {};
  const formHasChanges = Object.keys(formValues).some((key) => formValues[key]);

  if (formHasChanges) {
    return true;
  }

  const dataEntryValues = state.dataEntriesFieldsValue['singleEvent-newEvent'] || {};
  const dataEntryHasChanges = Object.keys(dataEntryValues).some((key) => dataEntryValues[key]);

  return dataEntryHasChanges;
};
