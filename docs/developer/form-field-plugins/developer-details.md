---
title: Developer details (Form Field Plugins)
sidebar_label: Developer details
id: developer-details
---

A form field plugin runs in a sandboxed environment, meaning it can only read and write data that it's been configured to have access to.
If the plugin is given access to a field, all relevant values, metadata, and rules engine output for that field is provided.
Also the context about the application state is provided, mainly if the plugin is in view or edit mode, or if the form has been attempted to be submitted.

If a plugin tries to update a field that it has not been given access to, an appropriate error message will be displayed in the console.

### Updating values from the plugin

To update values from the plugin, you can use the `setFieldValue` function that is passed as a prop to the plugin.

```ts
setFieldValue({
    fieldId: 'pluginAlias', // The alias of the field you want to update. This is the alias you have configured in the Tracker configurator app.
    value: 'myValue',
});
```

#### Expected value types

The `setFieldValue` function expects different value types depending on the element type. Below is a reference table of the expected value formats:

| Element Type | Value Type | Example |
|-------------|------------|---------|
| `TEXT`, `LONG_TEXT` | `string` | `"John Doe"` |
| `MULTI_TEXT` | `string` (comma-separated option codes) | `"code1,code2"` |
| `NUMBER`, `INTEGER`, `INTEGER_POSITIVE`, `INTEGER_NEGATIVE`, `INTEGER_ZERO_OR_POSITIVE`, `PERCENTAGE` | `string` | `"42"` |
| `NUMBER_RANGE`, `INTEGER_RANGE`, `INTEGER_POSITIVE_RANGE`, `INTEGER_NEGATIVE_RANGE`, `INTEGER_ZERO_OR_POSITIVE_RANGE`, `PERCENTAGE_RANGE` | `{ from: string, to: string }` | `{ from: "10", to: "20" }` |
| `DATE` | `string` (`YYYY-MM-DD`) | `"2024-01-15"` |
| `DATE_RANGE` | `{ from: string, to: string }` | `{ from: "2024-01-01", to: "2024-12-31" }` |
| `DATETIME` | `{ date: string, time: string }` | `{ date: "2024-01-15", time: "10:30" }` |
| `DATETIME_RANGE` | `{ from: { date: string, time: string }, to: { date: string, time: string } }` | `{ from: { date: "2024-01-01", time: "08:00" }, to: { date: "2024-01-02", time: "14:30" } }` |
| `TIME` | `string` (HH:mm) | `"14:30"` |
| `TIME_RANGE` | `{ from: string, to: string }` | `{ from: "08:00", to: "14:30" }` |
| `BOOLEAN` | `'true' \| 'false'` (string, not boolean) | `'true'` |
| `TRUE_ONLY` | `'true'` (string, not boolean) | `'true'` |
| `PHONE_NUMBER`, `EMAIL`, `URL`, `USERNAME` | `string` | `"user@example.com"` |
| `AGE` | `{ date: string }` | `{ date: "1990-05-15" }` |
| `COORDINATE` | `{ latitude: number, longitude: number }` | `{ latitude: 40.7128, longitude: -74.0060 }` |
| `POLYGON` | `Array<Array<Array<number>>>` | `[[[30, 10], [40, 40], [20, 40], [30, 10]]]` |
| `FILE_RESOURCE` | `{ value: string, name: string, url?: string }` | `{ value: "fileId123", name: "doc.pdf" }` |
| `IMAGE` | `{ value: string, name: string, url?: string, previewUrl?: string }` | `{ value: "imgId456", name: "photo.jpg" }` |
| `ORGANISATION_UNIT` | `{ id: string }` | `{ id: "orgUnitId" }` |

**Common examples:**

```ts
// Text field
setFieldValue({ fieldId: 'firstName', value: 'John' });

// Number field
setFieldValue({ fieldId: 'age', value: '25' });

// Date field
setFieldValue({ fieldId: 'birthDate', value: '1990-05-15' });

// Image field
setFieldValue({
    fieldId: 'photo',
    value: { value: 'fileResourceId', name: 'photo.jpg' }
});

// Coordinate field
setFieldValue({
    fieldId: 'location',
    value: { latitude: 40.7128, longitude: -74.0060 }
});

// With validation options
setFieldValue({
    fieldId: 'email',
    value: 'user@example.com',
    options: { touched: true }
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
    name: string;
    shortName: string;
    code: string;
    formName: string;
    disabled: boolean;
    compulsory: boolean;
    description: string;
    type: string;
    displayInForms: boolean;
    displayInReports: boolean;
    optionSet?: any;
    icon?: any;
    unique?: any;
    searchable?: boolean;
    url?: string;
    attributes?: Record<string, any>;
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
}

export type IFormFieldPluginProps = {
    orgUnitId: string;
    values: Record<string, any>;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    fieldsMetadata: Record<string, fieldsMetadata>;
    viewMode: boolean;
    formSubmitted: boolean;
    setFieldValue: (values: SetFieldValueProps) => void;
    setContextFieldValue: (values: SetContextFieldValueProps) => void;
}
```
