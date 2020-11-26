// @flow
import type { TrackerProgram } from '../../../../../metaData';
import type { TeiWorkingListsReduxOutputProps } from '../ReduxProvider';
import type {
    CustomColumnOrder,
    DeleteTemplate,
    UpdateList,
} from '../../WorkingListsCommon';

type ExtractedProps = $ReadOnly<{|
    customColumnOrder?: CustomColumnOrder,
    onDeleteTemplate: DeleteTemplate,
    onUpdateList: UpdateList,
    program: TrackerProgram,
|}>;

export type Props = $ReadOnly<{|
    ...TeiWorkingListsReduxOutputProps,
    ...ExtractedProps,
    programId: string,
|}>;
