import type { Geometry } from './helpers/types';
import type {
    DataEntryFormConfig,
} from '../../DataEntries/common/TEIAndEnrollment';

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
