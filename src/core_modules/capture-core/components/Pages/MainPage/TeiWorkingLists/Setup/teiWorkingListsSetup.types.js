// @flow
import type { TrackerProgram } from '../../../../../metaData';
import type { TeiWorkingListsReduxOutputProps } from '../ReduxProvider';
import type {
    CustomColumnOrder,
    DeleteTemplate,
    RecordsOrder,
    UpdateList,
} from '../../WorkingListsCommon';
import type { LoadTeiView, TeiRecords } from '../types';

type ExtractedProps = $ReadOnly<{|
    customColumnOrder?: CustomColumnOrder,
    onDeleteTemplate: DeleteTemplate,
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    program: TrackerProgram,
    records?: TeiRecords,
    recordsOrder?: RecordsOrder,
|}>;

export type Props = $ReadOnly<{|
    ...TeiWorkingListsReduxOutputProps,
    ...ExtractedProps,
|}>;
