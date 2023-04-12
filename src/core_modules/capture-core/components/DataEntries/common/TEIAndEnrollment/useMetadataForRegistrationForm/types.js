// @flow
import type { TeiRegistration, Enrollment } from '../../../../../metaData';

export type RegistrationFormMetadata = ?(TeiRegistration | Enrollment)

type ConfigElement = ?({|
    id: string,
    type: 'plugin',
    name: string,
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
        elements: Array<ConfigElement>,
    |}>
|}
