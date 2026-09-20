export type PluginFormFieldMetadata = {
    name: string;
    id: string;
    shortName: string;
    code: string;
    formName: string;
    compulsory: boolean;
    description: string;
    type: string;
    optionSet?: {
        code: string;
        name: string;
        options: {
            code: string;
            name: string;
            attributeValues?: { [pluginId: string]: any };
        }[];
    };
    searchable?: boolean;
    url?: string;
    attributeValues?: { [pluginId: string]: any };
};

type FieldValueOptions = {
    valid?: boolean;
    touched?: boolean;
    error?: string;
};

export type MetadataByPluginId = { [id: string]: PluginFormFieldMetadata };

export type FormattedPluginFormFieldMetadata =
    Omit<PluginFormFieldMetadata, 'id' | 'optionSet' | 'attributeValues'> & {
        disabled: boolean;
        displayInForms: boolean;
        displayInReports: boolean;
        optionSet?: any;
        icon?: any;
        unique?: any;
        attributes?: { [pluginSideName: string]: any };
    };

export type FormattedMetadataByPluginId = { [pluginId: string]: FormattedPluginFormFieldMetadata };

export type SetFieldValueProps = {
    fieldId: string;
    value: any;
    options?: FieldValueOptions;
};

export type PluginContext = {
    [key: string]: {
        setDataEntryFieldValue: (fieldValueProps: SetFieldValueProps) => void;
        value: any;
    };
};

export type ContainerProps = {
    pluginId: string;
    pluginSource: string;
    fieldsMetadata: Map<string, PluginFormFieldMetadata>;
    pluginContext: PluginContext;
    formId: string;
    customAttributes: { [id: string]: { IdFromPlugin: string; IdFromApp: string } };
    onUpdateFieldValue:
        (fieldMetadata: PluginFormFieldMetadata, newValue: any, oldValue: any, options?: FieldValueOptions) => void;
    viewMode?: boolean;
};

export type UsePluginCallbacksProps = {
    configuredPluginIds: string[];
    metadataByPluginId: MetadataByPluginId;
    onUpdateField: (fieldMetadata: PluginFormFieldMetadata, value: any, options?: FieldValueOptions) => void;
    pluginContext: PluginContext;
};

/**
 * IDs identifying the domain context a plugin is rendered in. Undefined where
 * not applicable (e.g. `teiId`/`enrollmentId` on an event-program form).
 * Shared between form-field plugins and widget plugins so both surfaces expose
 * the same names.
 */
export type PluginContextIds = {
    /** The entity's own org unit: TEI ownerOrgUnit on enrollment forms, event's own org unit on event forms. Not the top-bar selector. */
    orgUnitId: string | undefined;
    programId: string | undefined;
    /** Program stage — only meaningful in event contexts. */
    programStageId: string | undefined;
    /** Enrollment id — only for tracker (enrollment + tracker-event) contexts. */
    enrollmentId: string | undefined;
    /** Event id — only when editing an existing event. */
    eventId: string | undefined;
    /** TEI id — only for tracker contexts. */
    teiId: string | undefined;
};

export type ComponentProps = PluginContextIds & {
    pluginSource: string;
    fieldsMetadata: FormattedMetadataByPluginId;
    formSubmitted: boolean;
    /**
     * Field values keyed by the plugin's own field id or one of the context
     * keys (occurredAt, scheduledAt, enrolledAt, geometry, orgUnit) on forms
     * where those fields exist.
     */
    values: { [id: string]: unknown };
    setFieldValue: (props: SetFieldValueProps) => void;
    errors: { [id: string]: string[] };
    warnings: { [id: string]: string[] };
    setContextFieldValue: (props: SetFieldValueProps) => void;
    viewMode: boolean;
};
