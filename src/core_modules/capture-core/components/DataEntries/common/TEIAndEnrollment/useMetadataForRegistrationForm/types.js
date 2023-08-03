// @flow
import type { TeiRegistration, Enrollment } from '../../../../../metaData';
import { FormFieldTypes } from '../../../../D2Form/FormFieldPlugin/FormFieldPlugin.const';

export type RegistrationFormMetadata = ?(TeiRegistration | Enrollment)

type FieldElementObjectTypes = 'TrackedEntityAttribute' | 'Attribute'

type DataElementConfigElement = {|
    id: string,
    type: typeof FormFieldTypes.DATA_ELEMENT,
|}

type PluginConfigElement = {|
    id: string,
    type: typeof FormFieldTypes.PLUGIN,
    name: string,
    pluginSource: string,
    fieldMap: Array<{|
        IdFromApp: string,
        IdFromPlugin: string,
        objectType: FieldElementObjectTypes,
    |}>
|}

export type ConfigElement = PluginConfigElement | DataElementConfigElement;

export type DataEntryFormConfig = {|
    [key: string]: Array<{|
        id: string,
        name: string,
        pluginSource: string,
        elements: Array<ConfigElement>,
    |}>
|}
