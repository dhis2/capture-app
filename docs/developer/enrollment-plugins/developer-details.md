---
title: Developer details (Enrollment Plugins)
sidebar_label: Developer details
id: developer-details
---

Here are some details for developers who want to develop an enrollment plugin for the DHIS2 Capture app.

An enrollment plugin does not by default have access to any data or metadata. It is up to the plugin to request the data it needs from the DHIS2 API.
We do however provide all the necessary IDs and context details for the plugin to build its own business logic.

### Navigate the user

To navigate the user to a different page, you can use the `navigate` function that is passed as a prop to the plugin.

```ts
navigate('/path/to/page');
```

### Props

These are the props that an enrollment plugin can expect:

```ts
type EnrollmentPluginProps = {
    programId: string;
    orgUnitId: string;
    enrollmentId: string;
    teiId: string;
    programStageId?: string;
    eventId?: string;
    navigate: (url: string) => void;
}
```
