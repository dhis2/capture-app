// @flow

export const PluginErrorMessages = Object.freeze({
    SET_FIELD_VALUE_MISSING_ID: 'setFieldValue: missing required fieldId',
    SET_FIELD_VALUE_ID_NOT_ALLOWED: 'setFieldValue: fieldId must be one of the configured plugin ids',
});

export const FormFieldTypes = Object.freeze({
    DATA_ELEMENT: 'dataElement',
    PLUGIN: 'plugin',
});
