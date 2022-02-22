// @flow
import type { TrackerProgram } from '../../../../metaData';
import type { TeiWorkingListsReduxOutputProps } from '../ReduxProvider';
import type {
    CustomColumnOrder,
    RecordsOrder,
    UpdateList,
    InitialViewConfig,
    AddTemplate,
    DeleteTemplate,
    UpdateTemplate,
} from '../../WorkingListsCommon';
import type { FiltersData, WorkingListTemplates } from '../../WorkingListsBase';
import type { LoadTeiView, TeiRecords } from '../types';

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
    initialViewConfig: InitialViewConfig,
    filters?: FiltersData,
    sortById: string,
    sortByDirection: string,
    apiTemplates: WorkingListTemplates
|}>;

export type Props = $ReadOnly<{|
    ...TeiWorkingListsReduxOutputProps,
    ...ExtractedProps,
|}>;
