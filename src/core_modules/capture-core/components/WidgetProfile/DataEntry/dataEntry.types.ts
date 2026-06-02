import type { Geometry } from './helpers/types';
import type {
    DataEntryFormConfig,
} from '../../DataEntries/common/TEIAndEnrollment';
import type { PluginContext } from '../../D2Form/FormFieldPlugin/FormFieldPlugin.types';

export type PlainProps = {
    dataEntryId: string;
    trackedEntityName: string;
    saveAttempted: boolean;
    formFoundation: any;
    onCancel: () => void;
    onSave: () => void;
    onUpdateFormField: (innerAction: any) => void;
    onUpdateFormFieldAsync: (innerAction: any) => void;
    onGetValidationContext: () => Record<string, any>;
    modalState: string;
    errorsMessages: Array<{ id: string; message: string }>;
    warningsMessages: Array<{ id: string; message: string }>;
    orgUnitId: string;
    pluginContext?: PluginContext;
    accessReadOnly?: boolean;
};

export type ReadOnlyPlainProps = {
    dataEntryId: string;
    trackedEntityName: string;
    saveAttempted: boolean;
    formFoundation: any;
    onCancel: () => void;
    onUpdateFormField: (innerAction: any) => void;
    onUpdateFormFieldAsync: (innerAction: any) => void;
    onGetValidationContext: () => Record<string, any>;
    orgUnitId: string;
    pluginContext?: PluginContext;
    accessReadOnly?: boolean;
};

export type Props = {
    programAPI: any;
    orgUnitId: string;
    dataEntryFormConfig: DataEntryFormConfig | null;
    onCancel: () => void;
    onDisable: () => void;
    onEnable: () => void;
    clientAttributesWithSubvalues: Array<any>;
    trackedEntityInstanceId: string;
    onSaveSuccessActionType?: string;
    onSaveErrorActionType?: string;
    modalState: string;
    onSaveExternal?: (eventServerValues: any, uid: string) => void;
    geometry?: Geometry;
    userRoles: Array<string>;
    trackedEntityName: string;
    readOnly?: boolean;
    accessReadOnly?: boolean;
};
