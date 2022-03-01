// @flow
import { typeof dialogModes } from './dialogModes';
import type {
    WorkingListTemplate,
    SetTemplateSharingSettings,
    AddTemplate,
    UpdateTemplate,
    DeleteTemplate,
} from '../workingListsBase.types';

export type PassOnProps = {
    onClose: () => void,
};

export type Props = {
    ...PassOnProps,
    mode: ?$Values<dialogModes>,
    currentTemplate: WorkingListTemplate,
    onAddTemplate: AddTemplate,
    onUpdateTemplate: UpdateTemplate,
    onDeleteTemplate: DeleteTemplate,
    onSetSharingSettings: SetTemplateSharingSettings,
    templateSharingType: string,
};
