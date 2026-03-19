import type { ReactElement } from 'react';
import type { ValidatorContainer } from './internal/dataEntryField.utils';
import type { PluginContext } from '../../D2Form/FormFieldPlugin/FormFieldPlugin.types';
import { placements } from '../constants/placements.const';

export type FieldContainer = {
    field: ReactElement<any>;
    placement: typeof placements[keyof typeof placements];
    section?: string;
};

export type Props = {
    id: string;
    fields?: Array<ReactElement<any>>;
    pluginContext?: PluginContext;
    completionAttempted?: boolean;
    saveAttempted?: boolean;
    dataEntryFieldRef?: (instance: any, key: string) => void;
    onUpdateDataEntryField?: (
        innerAction: any,
        data: { value: any; valueMeta: any; fieldId: string; dataEntryId: string; itemId: string }
    ) => void;
};

export type Settings = {
    getComponent: (props: Record<string, any>) => React.ComponentType<any>;
    getComponentProps?: (props: Record<string, any>) => Record<string, any>;
    getPropName: (props: Record<string, any>) => string;
    getValidatorContainers?: (props: Record<string, any>) => Array<ValidatorContainer>;
    getMeta?: (props: Props) => Record<string, any>;
    getIsHidden?: (props: Record<string, any>) => boolean;
    getPassOnFieldData?: (props: Props) => boolean;
    getOnUpdateField?: (props: Record<string, any>) => (
        innerAction: any,
        data: { value: any; valueMeta: any; fieldId: string; dataEntryId: string; itemId: string }
    ) => void;
};
