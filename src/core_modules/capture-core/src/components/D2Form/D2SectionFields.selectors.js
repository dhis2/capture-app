// @flow
import { createSelectorCreator, defaultMemoize } from 'reselect';

const onIsEqual = (currentValues, prevValues) => {
    if (Object.keys(currentValues).every(key => currentValues[key] === prevValues[key])) {
        return Object.keys(prevValues).every(key => currentValues[key] === prevValues[key]);
    }
    return false;
};

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    onIsEqual,
);

const sectionValuesSelector = (state, props) => {
    const metaData = props.fieldsMetaData;
    const values = state.formsValues[props.formId] || {};
    const sectionValues = Array.from(metaData.entries())
        .map(entry => entry[1])
        .reduce((accValues, metaDataElement) => {
            accValues[metaDataElement.id] = values[metaDataElement.id];
            return accValues;
        }, {});
    return sectionValues;
};
export const makeGetSectionValues = () => createDeepEqualSelector(
    sectionValuesSelector,
    sectionValues => sectionValues,
);

const sectionHiddenFieldsSelector = (state, props) => {
    const metaData = props.fieldsMetaData;
    const hiddenFields = state.rulesEffectsHiddenFields[props.formId] || {};
    const sectionHiddenFields = Array.from(metaData.entries())
        .map(entry => entry[1])
        .reduce((accHiddenFields, metaDataElement) => {
            accHiddenFields[metaDataElement.id] = hiddenFields[metaDataElement.id];
            return accHiddenFields;
        }, {});
    return sectionHiddenFields;
};
export const makeGetHiddenFieldsValues = () => createDeepEqualSelector(
    sectionHiddenFieldsSelector,
    sectionHiddenFields => sectionHiddenFields,
);

const sectionRulesErrorMessagesSelector = (state, props) => {
    const metaData = props.fieldsMetaData;
    const errors = state.rulesEffectsErrorMessages[props.formId] || {};
    const sectionErrorMessages = Array.from(metaData.entries())
        .map(entry => entry[1])
        .reduce((accErrorFields, metaDataElement) => {
            accErrorFields[metaDataElement.id] = errors[metaDataElement.id];
            return accErrorFields;
        }, {});
    return sectionErrorMessages;
};
export const makeGetErrorMessages = () => createDeepEqualSelector(
    sectionRulesErrorMessagesSelector,
    sectionHiddenFields => sectionHiddenFields,
);

