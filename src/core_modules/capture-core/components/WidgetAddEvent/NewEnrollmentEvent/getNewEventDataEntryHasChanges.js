// @flow
export const getDataEntryHasChanges = (state: ReduxState) => {
    const formValues = state.formsValues['singleEvent-addEvent'] || {};
    const formHasChanges = Object
        .keys(formValues)
        .some(key => formValues[key]);

    if (formHasChanges) {
        return true;
    }

    const dataEntryValues = state.dataEntriesFieldsValue['singleEvent-addEvent'] || {};
    const dataEntryHasChanges = Object
        .keys(dataEntryValues)
        .some(key => dataEntryValues[key]);

    return dataEntryHasChanges;
};
