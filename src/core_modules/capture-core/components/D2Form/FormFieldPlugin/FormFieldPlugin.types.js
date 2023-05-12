// @flow

type PluginFormFieldMetadata = {|
    id: string;
    name: string;
    shortName: string;
    code: string;
    formName: string;
    disabled: boolean;
    compulsory: boolean;
    description: string;
    type: string;
    optionSet?: { id: string, name: string, options: Array<{ id: string, name: string }> };
    displayInForms: boolean;
    displayInReports: boolean;
    searchable: ?boolean;
    url: ?string;
    attributeValues: Array<{ [id: string]: any }>
|}

type FieldValueOptions = {|
    valid?: boolean,
    touched?: boolean,
    error?: string,
|}

export type MetadataByPluginId = { [id: string]: PluginFormFieldMetadata }

export type SetFieldValueProps = {|
    fieldId: string,
    value: any,
    options?: FieldValueOptions,
|}

export type PluginContext = {|
    [key: string]: {
        setDataEntryFieldValue: (fieldValueProps: SetFieldValueProps) => void,
        value: any
    }
|}

export type ContainerProps = {|
    pluginSource: string,
    fieldsMetadata: Map<string, PluginFormFieldMetadata>,
    pluginContext: PluginContext,
    formId: string,
    onUpdateField: (fieldMetadata: PluginFormFieldMetadata, value: any, options?: FieldValueOptions) => void,
|}

export type UsePluginCallbacksProps = {|
    configuredPluginIds: Array<string>,
    metadataByPluginId: MetadataByPluginId,
    onUpdateField: (fieldMetadata: PluginFormFieldMetadata, value: any, options?: FieldValueOptions) => void,
    pluginContext: PluginContext,
|}

export type ComponentProps = {|
    pluginSource: string,
    fieldsMetadata: MetadataByPluginId,
    formSubmitted: boolean,
    values: { [id: string]: any },
    setFieldValue: (SetFieldValueProps) => void,
    errors: { [id: string]: Array<string> },
    warnings: { [id: string]: Array<string> },
    setContextFieldValue: (SetFieldValueProps) => void,
|}
