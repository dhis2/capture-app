// @flow
import type { LoadTeiView, TeiRecords } from '../types';
import type { TeiWorkingListsReduxOutputProps } from '../ReduxProvider';
import type {
    CustomColumnOrder,
    RecordsOrder,
    UpdateList,
    InitialViewConfig,
} from '../../WorkingListsCommon';
import type { FiltersData } from '../../WorkingListsBase';
import type { TrackerProgram } from '../../../../metaData';

type ExtractedProps = $ReadOnly<{|
    customColumnOrder?: CustomColumnOrder,
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    program: TrackerProgram,
    records?: TeiRecords,
    recordsOrder?: RecordsOrder,
    currentTemplateId?: string,
    initialViewConfig: InitialViewConfig,
    filters?: FiltersData,
    sortById?: string,
    sortByDirection?: string,
|}>;

export type Props = $ReadOnly<{|
    ...TeiWorkingListsReduxOutputProps,
    ...ExtractedProps,
|}>;
