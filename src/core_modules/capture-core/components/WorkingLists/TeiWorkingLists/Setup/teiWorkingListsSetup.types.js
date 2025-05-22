// @flow
import type { TrackerProgram } from '../../../../metaData';
import type { TrackerWorkingListsBulkActionsSetupOutputProps } from '../BulkActionsController';
import type {
    CustomColumnOrder,
    RecordsOrder,
    UpdateList,
    InitialViewConfig,
    AddTemplate,
    DeleteTemplate,
    UpdateTemplate,
} from '../../WorkingListsCommon';
import type { WorkingListTemplates, ResetColumnOrder } from '../../WorkingListsBase';
import type { LoadTeiView, TeiRecords, ApiTrackerQueryCriteria, TeiWorkingListsTemplates } from '../types';

type ExtractedProps = $ReadOnly<{|
    customColumnOrder?: CustomColumnOrder,
    onLoadView: LoadTeiView,
    onAddTemplate: AddTemplate,
    onDeleteTemplate: DeleteTemplate,
    onUpdateTemplate: UpdateTemplate,
    onUpdateList: UpdateList,
    program: TrackerProgram,
    records?: TeiRecords,
    recordsOrder?: RecordsOrder,
    currentTemplateId?: string,
    initialViewConfig?: InitialViewConfig,
    apiTemplates: WorkingListTemplates,
    onResetListColumnOrder: ResetColumnOrder,
    onPreserveCurrentViewState: (templateId: string, critera: ApiTrackerQueryCriteria) => void,
    templates?: TeiWorkingListsTemplates
|}>;

type RestProps = $Rest<TrackerWorkingListsBulkActionsSetupOutputProps, ExtractedProps>;

export type Props = $ReadOnly<{|
    ...RestProps,
    ...ExtractedProps,
|}>;
