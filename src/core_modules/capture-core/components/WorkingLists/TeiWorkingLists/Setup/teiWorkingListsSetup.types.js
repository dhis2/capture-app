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
import type { FiltersData, SetTemplateSharingSettings } from '../../WorkingListsBase';
import type { LoadTeiView, TeiRecords } from '../types';

type ExtractedProps = $ReadOnly<{|
    customColumnOrder?: CustomColumnOrder,
    onLoadView: LoadTeiView,
    onSetTemplateSharingSettings: SetTemplateSharingSettings,
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
    storeId: string,
    sortById: string,
    sortByDirection: string,
|}>;

export type Props = $ReadOnly<{|
    ...TeiWorkingListsReduxOutputProps,
    ...ExtractedProps,
|}>;
