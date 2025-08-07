import type { TrackerProgram } from '../../../../metaData';
import type {
    CustomColumnOrder,
    RecordsOrder,
    UpdateList,
    InitialViewConfig,
    AddTemplate,
    DeleteTemplate,
    UpdateTemplate,
} from '../../WorkingListsCommon';
import type { FiltersData, WorkingListTemplates, SetTemplateSharingSettings } from '../../WorkingListsBase';
import type { LoadTeiView, TeiRecords } from '../types';
import type { TrackerWorkingListsTopBarActionsSetupOutputProps } from '../ActionsSetup';

type ExtractedProps = Readonly<{
    customColumnOrder?: CustomColumnOrder,
    onLoadView: LoadTeiView,
    onAddTemplate: AddTemplate,
    onDeleteTemplate: DeleteTemplate,
    onUpdateTemplate: UpdateTemplate,
    onSetTemplateSharingSettings: SetTemplateSharingSettings,
    onUpdateList: UpdateList,
    program: TrackerProgram,
    records?: TeiRecords,
    recordsOrder?: RecordsOrder,
    currentTemplateId?: string,
    initialViewConfig: InitialViewConfig,
    filters?: FiltersData,
    sortById: string,
    sortByDirection: string,
    templateSharingType: string,
    apiTemplates: WorkingListTemplates,
    forceUpdateOnMount?: boolean,
}>;

export type Props = Readonly<TrackerWorkingListsTopBarActionsSetupOutputProps & ExtractedProps>;
