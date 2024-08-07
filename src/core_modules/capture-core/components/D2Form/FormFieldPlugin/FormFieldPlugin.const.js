// @flow

export const PluginErrorMessages = Object.freeze({
    SET_FIELD_VALUE_MISSING_ID: 'setFieldValue: missing required fieldId',
    SET_FIELD_VALUE_ID_NOT_ALLOWED: 'setFieldValue: fieldId must be one of the configured plugin ids',
    SET_CONTEXT_FIELD_VALUE_MISSING_ID: 'setContextFieldValue: tried to set value for a field that does not exist in the plugin context',
});

export const FormFieldTypes = Object.freeze({
    // TODO [DHIS2-17605] - Unified field types
    DATA_ELEMENT: 'dataElement',
    PLUGIN: 'plugin',
});
