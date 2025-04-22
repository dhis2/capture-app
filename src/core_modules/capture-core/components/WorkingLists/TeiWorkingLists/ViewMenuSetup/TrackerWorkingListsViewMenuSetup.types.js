// @flow
import type { TrackerWorkingListsActionsSetupOutputProps } from '../ActionsSetup';
import type { UpdateList } from '../../WorkingListsCommon';
import type { LoadTeiView } from '../types';

type ExtractedProps = $ReadOnly<{|
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    storeId: string,
|}>;

export type Props = {|
    ...TrackerWorkingListsActionsSetupOutputProps,
    ...ExtractedProps,
|};

export type TrackerWorkingListsViewMenuSetupOutputProps = {|
    ...TrackerWorkingListsActionsSetupOutputProps,
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    customUpdateTrigger: ?string,
    allRowsAreSelected: ?boolean,
    selectedRows: { [key: string]: boolean },
    onRowSelect: (id: string) => void,
    onSelectAll: (rows: Array<string>) => void,
    selectionInProgress: ?boolean,
    bulkActionBarComponent: React$Element<any>,
|};
