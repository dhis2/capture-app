import type { WorkingListTemplate, AddTemplate, UpdateTemplate, DeleteTemplate, SetTemplateSharingSettings } from '../workingListsBase.types';
import type { CustomMenuContents } from '../../../ListView';
import type { ListViewConfigOutputProps } from '../ListViewConfig';

type ExtractedProps = {
    currentTemplate: WorkingListTemplate,
    onAddTemplate?: AddTemplate,
    onUpdateTemplate?: UpdateTemplate,
    onDeleteTemplate?: DeleteTemplate,
    onSetTemplateSharingSettings?: SetTemplateSharingSettings,
    currentViewHasTemplateChanges: boolean,
    customListViewMenuContents?: CustomMenuContents,
    templateSharingType: string,
};

type OptionalExtractedProps = {
    onAddTemplate: AddTemplate,
    onUpdateTemplate: UpdateTemplate,
    onDeleteTemplate: DeleteTemplate,
    onSetTemplateSharingSettings: SetTemplateSharingSettings,
    templateSharingType: string,
};

type RestProps = Omit<OptionalExtractedProps & ListViewConfigOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type ListViewConfigMenuContentOutputProps = Omit<RestProps, 'onAddTemplate' | 'onUpdateTemplate' | 'onDeleteTemplate' | 'onSetTemplateSharingSettings'> & {
    currentTemplate: WorkingListTemplate,
    customListViewMenuContents?: CustomMenuContents,
    onAddTemplate?: AddTemplate,
    onUpdateTemplate?: UpdateTemplate,
    onDeleteTemplate?: DeleteTemplate,
    onSetTemplateSharingSettings?: SetTemplateSharingSettings,
};
