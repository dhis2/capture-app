// @flow
import type { TrackerWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';

type ExtractedProps = $ReadOnly<{|
|}>;

type RestProps = $Rest<TrackerWorkingListsViewMenuSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...ExtractedProps,
    ...RestProps,
|};

export type TrackerWorkingListsBulkActionsSetupOutputProps = {|
    ...RestProps,
    customUpdateTrigger: ?string,
    allRowsAreSelected: ?boolean,
    selectedRows: { [key: string]: boolean },
    onRowSelect: (id: string) => void,
    onSelectAll: (rows: Array<string>) => void,
    selectionInProgress: ?boolean,
    bulkActionBarComponent: React$Element<any>,
|};
