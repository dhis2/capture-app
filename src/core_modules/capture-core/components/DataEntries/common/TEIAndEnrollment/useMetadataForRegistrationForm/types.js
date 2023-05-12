// @flow
import type { TeiRegistration, Enrollment } from '../../../../../metaData';
import { FormFieldTypes } from '../../../../D2Form/FormFieldPlugin/FormFieldPlugin.const';

export type RegistrationFormMetadata = ?(TeiRegistration | Enrollment)

type ConfigElement = ?({|
    id: string,
    type: typeof FormFieldTypes.PLUGIN,
    name: string,
    pluginSource: string,
    fieldMap: Array<{|
        IdFromApp: string,
        IdFromPlugin: string,
    |}>
|} | {|
    id: string,
    dataElement: 'dataElement',
|})

export type DataEntryFormConfig = {|
    [key: string]: Array<{|
        id: string,
        name: string,
        pluginSource: string,
        elements: Array<ConfigElement>,
    |}>
|}
