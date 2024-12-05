// @flow
import type { TrackerWorkingListsSetupOutputProps } from '../Setup';
import type { UpdateList } from '../../WorkingListsCommon';
import type { LoadTeiView } from '../types';

type ExtractedProps = $ReadOnly<{|
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    storeId: string,
|}>;

export type Props = {|
    ...TrackerWorkingListsSetupOutputProps,
    ...ExtractedProps,
|};
