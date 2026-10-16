import type { DataElementUnique, Option, OptionSet } from '../../../metaData';

export type PluginAttributeValue = {
    attribute: { id: string };
    value: unknown;
};

export type PluginOption = {
    code: string;
    name: string;
    attributeValues?: PluginAttributeValue[];
};

export type PluginOptionSet = {
    code: string;
    name: string;
    options: PluginOption[];
};

export type PluginFormFieldMetadata = {
    name: string;
    id: string;
    shortName: string;
    code: string;
    formName: string;
    compulsory: boolean;
    description: string;
    type: string;
    optionSet?: PluginOptionSet;
    searchable?: boolean;
    url?: string;
    attributeValues?: PluginAttributeValue[];
};

export type FormattedIcon = {
    name?: string;
    color?: string;
};

export type FormattedUnique = {
    generatable: boolean;
    scope: DataElementUnique['scope'];
};

export type FormattedOption = {
    code: string;
    value: Option['value'];
    text: string;
    description?: string;
    icon?: FormattedIcon;
    attributes?: Record<string, unknown>;
};

export type FormattedOptionSet = {
    options: FormattedOption[];
    inputType: OptionSet['inputType'];
    viewType?: OptionSet['viewType'];
    emptyText?: string;
    attributes?: Record<string, unknown>;
};

export type FormattedPluginFormFieldMetadata = {
    name: string;
    shortName: string;
    code: string;
    formName: string;
    compulsory: boolean;
    description: string;
    type: string;
    searchable?: boolean;
    url?: string;
    disabled: boolean;
    displayInForms: boolean;
    displayInReports: boolean;
    optionSet?: FormattedOptionSet;
    icon?: FormattedIcon;
    unique?: FormattedUnique;
    attributes?: Record<string, unknown>;
};

export type MetadataByPluginId = Record<string, PluginFormFieldMetadata>;
export type FormattedMetadataByPluginId = Record<string, FormattedPluginFormFieldMetadata>;

export type FieldValueOptions = {
    valid?: boolean;
    touched?: boolean;
    error?: string;
};

export type SetFieldValueProps = {
    fieldId: string;
    value: unknown;
    options?: FieldValueOptions;
};

export type OnUpdateFieldValue = (
    fieldMetadata: PluginFormFieldMetadata,
    newValue: unknown,
    oldValue: unknown,
    options?: FieldValueOptions,
) => void;

export type OnUpdateField = (
    fieldMetadata: PluginFormFieldMetadata,
    value: unknown,
    options?: FieldValueOptions,
) => void;

export type PluginContextEntry<TValue = unknown> = {
    setDataEntryFieldValue: (value: unknown) => void;
    value: TValue;
};

export type PluginContext = {
    orgUnit?: PluginContextEntry<{ id: string } | undefined>;
    [key: string]: PluginContextEntry<unknown> | undefined;
};

export type PluginContextIds = {
    ownerOrgUnitId: string | undefined;
    programId: string | undefined;
    programStageId: string | undefined;
    enrollmentId: string | undefined;
    eventId: string | undefined;
    teiId: string | undefined;
};

export type CustomAttributeMapping = {
    IdFromPlugin: string;
    IdFromApp: string;
};

export type ContainerProps = {
    pluginId: string;
    pluginSource: string;
    fieldsMetadata: Map<string, PluginFormFieldMetadata>;
    pluginContext: PluginContext;
    formId: string;
    customAttributes: Record<string, CustomAttributeMapping>;
    onUpdateFieldValue: OnUpdateFieldValue;
    viewMode?: boolean;
};

export type UsePluginCallbacksProps = {
    configuredPluginIds: string[];
    metadataByPluginId: MetadataByPluginId;
    onUpdateField: OnUpdateField;
    pluginContext: PluginContext;
};

export type ComponentProps = PluginContextIds & {
    pluginSource: string;
    fieldsMetadata: FormattedMetadataByPluginId;
    formSubmitted: boolean;
    values: Record<string, unknown>;
    setFieldValue: (props: SetFieldValueProps) => void;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    setContextFieldValue: (props: SetFieldValueProps) => void;
    viewMode: boolean;
};
