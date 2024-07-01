---
title: Developer details (Form Field Plugins)
sidebar_label: Developer details
id: developer-details
---

Here are some details for developers who want to develop a form field plugin for the DHIS2 Capture app.

A form field plugin runs in a sandboxed environment, meaning it can only read and write data that it's been configured to have access to.
If the plugin is given access to a field, we provide any relevant values, metadata, and rules engine output for that field.
We also provide some context about the application state, mainly if the plugin is in view or edit mode, or if the form has been attempted submitted.

If a plugin tries to update a field that it has not been given access to, an appropriate error message will be displayed in the console.

### Updating values from the plugin

To update values from the plugin, you can use the `setFieldValue` function that is passed as a prop to the plugin.

```ts
setFieldValue({
    fieldId: 'pluginAlias', // The alias of the field you want to update. This is the alias you have configured in the Tracker configurator app.
    value: 'myValue',
});
```

### Updating context values

You can also update context values from the plugin using the `setContextFieldValue` function that is passed as a prop to the plugin.
Context values are values that explains the context of the data, such as the geometry, the date of the event, or the date of enrollment.

```ts
setContextFieldValue({
    fieldId: 'occurredAt', // The context field you want to update. (occurredAt, enrolledAt, geometry)
    value: '2022-01-01',
});
```

### Props

The props that a form field plugin can expect are as follows:

```ts
type fieldsMetadata = {
    id: string;
    name: string;
    shortName: string;
    formName: string;
    disabled: boolean;
    compulsory: boolean;
    description: string;
    type: string;
    optionSet: any;
    displayInForms: boolean;
    displayInReports: boolean;
    icon: any;
    unique: any;
    searchable: boolean | undefined;
    url: string | undefined;
}

type FieldValueOptions = {
    valid?: boolean,
    touched?: boolean,
    error?: string,
}

export type SetFieldValueProps = {
    fieldId: string,
    value: any,
    options?: FieldValueOptions,
}

type SetContextFieldValueProps = {
    fieldId: 'geometry' | 'occurredAt' | 'enrolledAt'
    value: any,
    options?: FieldValueOptions,
}

export type IFormFieldPluginProps = {
    values: Record<string, any>;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    fieldsMetadata: Record<string, fieldsMetadata>;
    setFieldValue: (values: SetFieldValueProps) => void;
    setContextFieldValue: (values: SetContextFieldValueProps) => void;
    viewMode: boolean;
    formSubmitted: boolean;
}
```
