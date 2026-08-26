import type { ComponentType } from 'react';
import type { ValidatorContainer } from '../DataEntry/dataEntryField/internal/dataEntryField.utils';

export type Props = {
    id: string;
    fields?: Array<React.ReactElement<any>> | null;
    completionAttempted?: boolean | null;
    saveAttempted?: boolean | null;
    dataEntryFieldRef?: (instance: any, key: string) => void | null;
    onUpdateDataEntryField?: (innerAction: any, data: { value: any }) => void;
};

export type Settings = {
    getComponent: (props: any) => ComponentType<any>;
    getComponentProps?: (props: any, fieldId: string, extraProps?: any) => any;
    getPropName: (props: any, fieldId?: string) => string;
    getValidatorContainers?: (props: any, fieldId?: string) => Array<ValidatorContainer>;
    getMeta?: (props: Props) => any;
    getFieldIds?: (props: Props) => Array<any>;
    getIsHidden?: (props: any) => boolean;
    getPassOnFieldData?: (props: Props) => boolean;
    getOnUpdateField?: (props: any) => (innerAction: any, data: { value: any }) => void;
};
