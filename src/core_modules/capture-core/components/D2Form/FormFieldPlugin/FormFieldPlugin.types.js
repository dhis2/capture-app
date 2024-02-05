// @flow

export type PluginFormFieldMetadata = {|
    name: string;
    id: string,
    shortName: string;
    code: string;
    formName: string;
    compulsory: boolean;
    description: string;
    type: string;
    optionSet?: {
        code: string,
        name: string,
        options: Array<{
            code: string,
            name: string,
            attributeValues?: { [pluginId: string]: any }
        }>
    };
    searchable: ?boolean;
    url: ?string;
    attributeValues?: { [pluginId: string]: any }

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
    pluginId: string,
    pluginSource: string,
    fieldsMetadata: Map<string, PluginFormFieldMetadata>,
    pluginContext: PluginContext,
    formId: string,
    customAttributes: { [id: string]: { IdFromPlugin: string, IdFromApp: string } },
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
    orgUnitId: string,
    setFieldValue: (SetFieldValueProps) => void,
    errors: { [id: string]: Array<string> },
    warnings: { [id: string]: Array<string> },
    setContextFieldValue: (SetFieldValueProps) => void,
|}
