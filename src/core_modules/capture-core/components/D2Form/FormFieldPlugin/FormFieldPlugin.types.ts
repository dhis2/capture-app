import type { DataElement, DataElementUnique, OptionSet, dataElementTypes } from '../../../metaData';
import type { SearchOperator } from '../../../metaDataMemoryStoreBuilders';
import type { PluginContextIds, PluginHostProps } from '../../Plugins';

export type { PluginContextIds, PluginHostProps };

type FormattedIcon = {
    name?: string;
    color?: string;
};

type FormattedUnique = {
    generatable: boolean;
    scope: DataElementUnique['scope'];
};

type FormattedOption = {
    code: string;
    value: string | number | boolean;
    text: string;
    description?: string;
    icon?: FormattedIcon;
    attributes?: Record<string, any>;
};

type FormattedOptionSet = {
    options: FormattedOption[];
    inputType: OptionSet['inputType'];
    viewType?: OptionSet['viewType'];
    emptyText?: string;
    attributes?: Record<string, any>;
};

export type FormattedPluginFormFieldMetadata = {
    name: string;
    shortName: string;
    code: string;
    formName: string;
    compulsory: boolean;
    description: string;
    type: keyof typeof dataElementTypes;
    searchable?: boolean;
    url?: string;
    disabled: boolean;
    displayInForms: boolean;
    displayInReports: boolean;
    optionSet?: FormattedOptionSet;
    icon?: FormattedIcon;
    unique?: FormattedUnique;
    attributes?: Record<string, any>;
    inherit?: boolean;
    minCharactersToSearch?: number;
    searchOperator?: SearchOperator;
    allowFutureDate?: boolean;
};

export type MetadataByPluginId = Record<string, DataElement>;
export type FormattedMetadataByPluginId = Record<string, FormattedPluginFormFieldMetadata>;

type FieldValueOptions = {
    valid?: boolean;
    touched?: boolean;
    error?: string;
};

export type SetFieldValueProps = {
    fieldId: string;
    value: any;
    options?: FieldValueOptions;
};

type OnUpdateFieldValue = (
    fieldMetadata: DataElement,
    newValue: any,
    oldValue: any,
    options?: FieldValueOptions,
) => void;

type OnUpdateField = (
    fieldMetadata: DataElement,
    value: any,
    options?: FieldValueOptions,
) => void;

export type PluginContextEntry<TValue = any> = {
    setDataEntryFieldValue: (value: any) => void;
    value: TValue;
};

export type PluginContext = {
    orgUnit?: PluginContextEntry<{ id: string } | undefined>;
    [key: string]: PluginContextEntry<any> | undefined;
};

type CustomAttributeMapping = {
    IdFromPlugin: string;
    IdFromApp: string;
};

export type ContainerProps = PluginHostProps & {
    pluginId: string;
    fieldsMetadata: Map<string, DataElement>;
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

export type ComponentProps = PluginContextIds & PluginHostProps & {
    fieldsMetadata: FormattedMetadataByPluginId;
    formSubmitted: boolean;
    values: Record<string, any>;
    setFieldValue: (props: SetFieldValueProps) => void;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    setContextFieldValue: (props: SetFieldValueProps) => void;
    viewMode: boolean;
};
