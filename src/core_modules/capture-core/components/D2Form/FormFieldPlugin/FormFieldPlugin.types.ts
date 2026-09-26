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

type PluginContextEntry<TValue = unknown> = {
    setDataEntryFieldValue: (fieldValueProps: SetFieldValueProps) => void;
    value: TValue;
};

export type PluginContext = {
    orgUnit?: PluginContextEntry<{ id: string } | undefined>;
    [key: string]: PluginContextEntry<any> | undefined;
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

export type PluginContextIds = {
    orgUnitId: string | undefined;
    programId: string | undefined;
    programStageId: string | undefined;
    enrollmentId: string | undefined;
    eventId: string | undefined;
    teiId: string | undefined;
};

export type ComponentProps = PluginContextIds & {
    pluginSource: string;
    fieldsMetadata: FormattedMetadataByPluginId;
    formSubmitted: boolean;
    values: { [id: string]: unknown };
    setFieldValue: (props: SetFieldValueProps) => void;
    errors: { [id: string]: string[] };
    warnings: { [id: string]: string[] };
    setContextFieldValue: (props: SetFieldValueProps) => void;
    viewMode: boolean;
};
