---
title: setFieldValue Reference
sidebar_label: setFieldValue Reference
id: setFieldValue-reference
---

## Overview

When working with Form Field Plugins, the `setFieldValue` function is passed as a prop to allow the plugin to update field values. This reference table provides detailed information about the expected value types for different element types.

## Value Type Reference Table

The table below details the expected value types that should be passed to `setFieldValue` for each element type:

| Element Type | Value Type | Description | Example |
|-------------|------------|-------------|---------|
| `TEXT` | `string` | Plain text value | `"John Doe"` |
| `MULTI_TEXT` | `string` | Multi-line text value | `"Line 1\nLine 2\nLine 3"` |
| `LONG_TEXT` | `string` | Long text value | `"This is a longer text..."` |
| `NUMBER` | `number \| string` | Numeric value | `42` or `"42"` |
| `NUMBER_RANGE` | `{ from: number \| string, to: number \| string }` | Number range with from and to values | `{ from: 10, to: 20 }` |
| `INTEGER` | `number \| string` | Integer value | `25` or `"25"` |
| `INTEGER_RANGE` | `{ from: number \| string, to: number \| string }` | Integer range with from and to values | `{ from: 5, to: 15 }` |
| `INTEGER_POSITIVE` | `number \| string` | Positive integer value | `10` |
| `INTEGER_POSITIVE_RANGE` | `{ from: number \| string, to: number \| string }` | Positive integer range | `{ from: 1, to: 100 }` |
| `INTEGER_NEGATIVE` | `number \| string` | Negative integer value | `-5` |
| `INTEGER_NEGATIVE_RANGE` | `{ from: number \| string, to: number \| string }` | Negative integer range | `{ from: -100, to: -1 }` |
| `INTEGER_ZERO_OR_POSITIVE` | `number \| string` | Zero or positive integer value | `0` or `15` |
| `INTEGER_ZERO_OR_POSITIVE_RANGE` | `{ from: number \| string, to: number \| string }` | Zero or positive integer range | `{ from: 0, to: 50 }` |
| `PERCENTAGE` | `number \| string` | Percentage value (0-100) | `75` or `"75"` |
| `DATE` | `string` | Date in ISO format (YYYY-MM-DD) | `"2024-01-15"` |
| `DATE_RANGE` | `{ from: string, to: string }` | Date range with from and to dates | `{ from: "2024-01-01", to: "2024-12-31" }` |
| `DATETIME` | `string` | DateTime in ISO format | `"2024-01-15T10:30:00"` |
| `DATETIME_RANGE` | `{ from: string, to: string }` | DateTime range | `{ from: "2024-01-15T00:00:00", to: "2024-01-15T23:59:59" }` |
| `TIME` | `string` | Time in HH:mm format | `"14:30"` |
| `TIME_RANGE` | `{ from: string, to: string }` | Time range | `{ from: "09:00", to: "17:00" }` |
| `BOOLEAN` | `boolean` | Boolean value | `true` or `false` |
| `TRUE_ONLY` | `boolean` | True-only checkbox value | `true` |
| `PHONE_NUMBER` | `string` | Phone number | `"+1-555-0123"` |
| `EMAIL` | `string` | Email address | `"user@example.com"` |
| `URL` | `string` | URL string | `"https://example.com"` |
| `AGE` | `{ date: string, years?: number, months?: number, days?: number }` | Age object with date or duration components | `{ date: "1990-05-15" }` or `{ years: 25, months: 6 }` |
| `COORDINATE` | `{ latitude: number, longitude: number }` | Geographic coordinate with latitude and longitude | `{ latitude: 40.7128, longitude: -74.0060 }` |
| `POLYGON` | `Array<Array<Array<number>>>` | Polygon coordinates as nested arrays [longitude, latitude] | `[[[30.0, 10.0], [40.0, 40.0], [20.0, 40.0], [10.0, 20.0], [30.0, 10.0]]]` |
| `FILE_RESOURCE` | `{ value: string, name: string, url?: string }` | File resource object with file ID, name, and optional URL | `{ value: "abc123", name: "document.pdf", url: "https://..." }` |
| `IMAGE` | `{ value: string, name: string, url?: string, previewUrl?: string }` | Image resource object with file ID, name, and optional URLs | `{ value: "img456", name: "photo.jpg", url: "https://...", previewUrl: "https://..." }` |
| `ORGANISATION_UNIT` | `{ id: string, name?: string, path?: string }` | Organisation unit object with ID and optional metadata | `{ id: "orgUnit123", name: "District Hospital", path: "/country/region/district" }` |
| `USERNAME` | `string` | Username string | `"jdoe"` |
| `ASSIGNEE` | `{ id: string, name?: string, username?: string }` | Assignee user object | `{ id: "user123", name: "John Doe", username: "jdoe" }` |

## Common Examples

### Text Fields

```ts
setFieldValue({
    fieldId: 'firstName',
    value: 'John',
});

setFieldValue({
    fieldId: 'description',
    value: 'This is a multi-line\ndescription text',
});
```

### Number Fields

```ts
setFieldValue({
    fieldId: 'age',
    value: 25,
});

setFieldValue({
    fieldId: 'score',
    value: "95.5", // Can be passed as string
});
```

### Date Fields

```ts
setFieldValue({
    fieldId: 'birthDate',
    value: '1990-05-15',
});

setFieldValue({
    fieldId: 'visitDateTime',
    value: '2024-01-15T10:30:00',
});
```

### Image and File Fields

```ts
// Image field
setFieldValue({
    fieldId: 'profilePhoto',
    value: {
        value: 'fileResourceId123',
        name: 'profile.jpg',
        url: 'https://example.com/files/fileResourceId123',
        previewUrl: 'https://example.com/thumbnails/fileResourceId123'
    },
});

// File field
setFieldValue({
    fieldId: 'attachment',
    value: {
        value: 'fileResourceId456',
        name: 'document.pdf',
        url: 'https://example.com/files/fileResourceId456'
    },
});
```

### Coordinate Field

```ts
setFieldValue({
    fieldId: 'location',
    value: {
        latitude: 40.7128,
        longitude: -74.0060
    },
});
```

### Polygon Field

```ts
setFieldValue({
    fieldId: 'boundary',
    value: [
        [
            [30.0, 10.0],
            [40.0, 40.0],
            [20.0, 40.0],
            [10.0, 20.0],
            [30.0, 10.0]  // First and last coordinates should be the same to close the polygon
        ]
    ],
});
```

### Age Field

```ts
// Using date of birth
setFieldValue({
    fieldId: 'patientAge',
    value: {
        date: '1990-05-15'
    },
});

// Using age components
setFieldValue({
    fieldId: 'patientAge',
    value: {
        years: 25,
        months: 6,
        days: 15
    },
});
```

### Organisation Unit Field

```ts
setFieldValue({
    fieldId: 'facility',
    value: {
        id: 'orgUnit123',
        name: 'District Hospital',
        path: '/country/region/district'
    },
});
```

### Range Fields

```ts
// Number range
setFieldValue({
    fieldId: 'temperatureRange',
    value: {
        from: 36.5,
        to: 37.5
    },
});

// Date range
setFieldValue({
    fieldId: 'treatmentPeriod',
    value: {
        from: '2024-01-01',
        to: '2024-06-30'
    },
});
```

### Boolean Fields

```ts
setFieldValue({
    fieldId: 'consent',
    value: true,
});

setFieldValue({
    fieldId: 'hasSymptoms',
    value: false,
});
```

### Assignee Field

```ts
setFieldValue({
    fieldId: 'assignedTo',
    value: {
        id: 'user123',
        name: 'John Doe',
        username: 'jdoe'
    },
});
```

## Field Validation Options

When calling `setFieldValue`, you can optionally include validation state information:

```ts
setFieldValue({
    fieldId: 'email',
    value: 'user@example.com',
    options: {
        valid: true,
        touched: true,
        error: undefined
    },
});

// With error
setFieldValue({
    fieldId: 'email',
    value: 'invalid-email',
    options: {
        valid: false,
        touched: true,
        error: 'Please enter a valid email address'
    },
});
```

## Notes

- All value types must match the expected format for the element type. Passing incorrect value types may result in validation errors or unexpected behavior.
- For file and image fields, the `value` property should contain the DHIS2 file resource ID, not the actual file content.
- Coordinate values use the standard latitude/longitude format (latitude: -90 to 90, longitude: -180 to 180).
- Polygon coordinates are specified as [longitude, latitude] pairs (note the reversed order compared to coordinate fields).
- Date strings should follow the ISO 8601 format (YYYY-MM-DD for dates, YYYY-MM-DDTHH:mm:ss for datetimes).
- Range fields require both `from` and `to` properties to be specified.

## See Also

- [Developer Details](developer-details.md) - Complete reference for Form Field Plugin props and functionality
- [Introduction](introduction.md) - Overview of Form Field Plugins and use cases
- [Manual Setup](manual-setup.md) - Guide for manually configuring Form Field Plugins
