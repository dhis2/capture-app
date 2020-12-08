// @flow
import type { TrackerProgram } from '../../../../../metaData';
import type { TeiWorkingListsReduxOutputProps } from '../ReduxProvider';
import type {
    CustomColumnOrder,
    RecordsOrder,
    UpdateList,
} from '../../WorkingListsCommon';
import type { FiltersData } from '../../WorkingLists';
import type { LoadTeiView, TeiRecords } from '../types';

type ExtractedProps = $ReadOnly<{|
    customColumnOrder?: CustomColumnOrder,
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    program: TrackerProgram,
    records?: TeiRecords,
    recordsOrder?: RecordsOrder,
    currentTemplateId?: string,
    initialViewConfig: Object,
    filters?: FiltersData,
    sortById?: string,
    sortByDirection?: string,
|}>;

export type Props = $ReadOnly<{|
    ...TeiWorkingListsReduxOutputProps,
    ...ExtractedProps,
|}>;
