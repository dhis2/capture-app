// @flow
import type { TrackerWorkingListssSetupOutputProps } from '../Setup';
import type { UpdateList } from '../../WorkingListsCommon';
import type { LoadTeiView } from '../types';

type ExtractedProps = $ReadOnly<{|
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    storeId: string,
|}>;

export type Props = {|
    ...TrackerWorkingListssSetupOutputProps,
    ...ExtractedProps,
|};

export type TrackerWorkingListsViewMenuSetupOutputProps = {|
    ...TrackerWorkingListssSetupOutputProps,
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
