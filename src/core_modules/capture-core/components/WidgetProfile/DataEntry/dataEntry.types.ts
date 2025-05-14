import type { Geometry } from './helpers/types';
import type {
    DataEntryFormConfig,
} from '../../DataEntries/common/TEIAndEnrollment';

export type ReduxAction<T, P> = {
    type: T;
    payload: P;
};

export type PlainProps = {
    dataEntryId: string;
    itemId: string;
    trackedEntityName: string;
    saveAttempted: boolean;
    formFoundation: any;
    onCancel: () => void;
    onSave: () => void;
    onUpdateFormField: (innerAction: ReduxAction<any, any>) => void;
    onUpdateFormFieldAsync: (innerAction: ReduxAction<any, any>) => void;
    onGetValidationContext: () => Object;
    modalState: string;
    errorsMessages: Array<{ id: string; message: string }>;
    warningsMessages: Array<{ id: string; message: string }>;
    center?: Array<number> | null;
    orgUnit: { id: string };
};

export type Props = {
    programAPI: any;
    orgUnitId: string;
    dataEntryFormConfig?: DataEntryFormConfig;
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
};
