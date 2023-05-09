// @flow

import type { DataElement } from '../../../metaData';


type FieldValueOptions = {|
    valid?: boolean,
    touched?: boolean,
    error?: string,
|}

export type MetadataByPluginId = { [id: string]: DataElement }

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
    fieldsMetadata: Map<string, DataElement>,
    pluginContext: PluginContext,
    formId: string,
    onUpdateField: (fieldId: string, value: any, options?: FieldValueOptions) => void,
|}

export type UsePluginCallbacksProps = {|
    configuredPluginIds: Array<string>,
    metadataByPluginId: MetadataByPluginId,
    onUpdateField: (fieldId: string, value: any, options?: FieldValueOptions) => void,
    pluginContext: PluginContext,
|}

export type ComponentProps = {|
    pluginSource: string,
    fieldsMetadata: MetadataByPluginId,
    values: { [id: string]: any },
    setFieldValue: (SetFieldValueProps) => void,
    errors: { [id: string]: Array<string> },
    warnings: { [id: string]: Array<string> },
    setContextFieldValue: (SetFieldValueProps) => void,
|}
