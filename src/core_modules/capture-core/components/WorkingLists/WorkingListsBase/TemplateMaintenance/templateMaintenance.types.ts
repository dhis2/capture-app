import type { dialogModes } from './dialogModes';
import type {
    WorkingListTemplate,
    SetTemplateSharingSettings,
    AddTemplate,
    UpdateTemplate,
    DeleteTemplate,
} from '../workingListsBase.types';

export type PassOnProps = {
    onClose: () => void;
};

export type Props = PassOnProps & {
    mode?: keyof typeof dialogModes | null;
    currentTemplate: WorkingListTemplate;
    onAddTemplate: AddTemplate;
    onUpdateTemplate: UpdateTemplate;
    onDeleteTemplate: DeleteTemplate;
    onSetSharingSettings: SetTemplateSharingSettings;
    templateSharingType: string;
};
