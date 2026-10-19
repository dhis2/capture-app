// Types shared by every plugin kind (form field plugins and enrollment widget plugins).

// Ids describing the record a plugin is working on. Passed into the plugin as props.
export type PluginContextIds = {
    ownerOrgUnitId: string | undefined;
    programId: string | undefined;
    programStageId: string | undefined;
    enrollmentId: string | undefined;
    eventId: string | undefined;
    teiId: string | undefined;
};

// What a host component needs to create the plugin. Never reaches the plugin itself.
export type PluginHostProps = {
    pluginSource: string;
};
