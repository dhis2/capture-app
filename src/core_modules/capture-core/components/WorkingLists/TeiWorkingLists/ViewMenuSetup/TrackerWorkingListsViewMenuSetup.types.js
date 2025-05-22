// @flow
import type { TeiWorkingListsReduxOutputProps } from '../ReduxProvider';
import type { UpdateList, LoadView } from '../../WorkingListsCommon';
import type { LoadTeiView, UpdateTrackerList } from '../types';

type ExtractedProps = $ReadOnly<{|
    onLoadView: LoadView,
    onUpdateList: UpdateList,
    storeId: string,
|}>;

type RestProps = $Rest<TeiWorkingListsReduxOutputProps, ExtractedProps>;

export type Props = {|
    ...ExtractedProps,
    ...RestProps,
|};

export type TrackerWorkingListsViewMenuSetupOutputProps = {|
    ...RestProps,
    onLoadView: LoadTeiView,
    onUpdateList: UpdateTrackerList,
|};
