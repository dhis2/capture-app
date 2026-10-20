import type { DataElement, DataElementUnique, OptionSet, dataElementTypes } from '../../../metaData';
import type { SearchOperator } from '../../../metaDataMemoryStoreBuilders';

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

export type PluginContextIds = {
    ownerOrgUnitId: string | undefined;
    programId: string | undefined;
    programStageId: string | undefined;
    enrollmentId: string | undefined;
    eventId: string | undefined;
    teiId: string | undefined;
};

type CustomAttributeMapping = {
    IdFromPlugin: string;
    IdFromApp: string;
};

export type ContainerProps = {
    pluginId: string;
    pluginSource: string;
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

export type ComponentProps = PluginContextIds & {
    pluginSource: string;
    fieldsMetadata: FormattedMetadataByPluginId;
    formSubmitted: boolean;
    values: Record<string, any>;
    setFieldValue: (props: SetFieldValueProps) => void;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    setContextFieldValue: (props: SetFieldValueProps) => void;
    viewMode: boolean;
};
