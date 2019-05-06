// @flow
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';

const onIsEqual = (prevValues, currentValues) =>
    Object.keys(currentValues).every(key => currentValues[key] === prevValues[key]);


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

const sectionIsCompulsorySelector = (state, props) => {
    const metaData = props.fieldsMetaData;
    const compulsoryFields = state.rulesEffectsCompulsoryFields[props.formId] || {};
    const sectionCompulsoryFields = Array.from(metaData.entries())
        .map(entry => entry[1])
        .reduce((accCompulsoryFields, metaDataElement) => {
            accCompulsoryFields[metaDataElement.id] = compulsoryFields[metaDataElement.id];
            return accCompulsoryFields;
        }, {});
    return sectionCompulsoryFields;
};
export const makeGetCompulsory = () => createDeepEqualSelector(
    sectionIsCompulsorySelector,
    sectionCompulsoryFields => sectionCompulsoryFields,
);

const sectionIsDisabledSelector = (state, props) => {
    const metaData = props.fieldsMetaData;
    const disabledFields = state.rulesEffectsDisabledFields[props.formId] || {};
    const sectionDisabledFields = Array.from(metaData.entries())
        .map(entry => entry[1])
        .reduce((accDisabledFields, metaDataElement) => {
            accDisabledFields[metaDataElement.id] = disabledFields[metaDataElement.id];
            return accDisabledFields;
        }, {});
    return sectionDisabledFields;
};
export const makeGetDisabled = () => createDeepEqualSelector(
    sectionIsDisabledSelector,
    sectionDisabledFields => sectionDisabledFields,
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

const createMessagesDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    (prevValues, currentValues) =>
        Object.keys(currentValues).every((key) => {
            const currentMessagesForId = currentValues[key] || {};
            const prevMessagesForId = prevValues[key] || {};
            return [messageStateKeys.ERROR, messageStateKeys.WARNING, messageStateKeys.ERROR_ON_COMPLETE, messageStateKeys.WARNING_ON_COMPLETE].every(messageKey => currentMessagesForId[messageKey] === prevMessagesForId[messageKey]);
        }),
);

const sectionRulesMessagesSelector = (state, props) => {
    const metaData = props.fieldsMetaData;
    const messages = state.rulesEffectsMessages[props.formId] || {};
    const sectionErrorMessages = Array.from(metaData.entries())
        .map(entry => entry[1])
        .reduce((accErrorFields, metaDataElement) => {
            accErrorFields[metaDataElement.id] = messages[metaDataElement.id];
            return accErrorFields;
        }, {});
    return sectionErrorMessages;
};
export const makeGetMessages = () => createMessagesDeepEqualSelector(
    sectionRulesMessagesSelector,
    sectionMessages => sectionMessages,
);

