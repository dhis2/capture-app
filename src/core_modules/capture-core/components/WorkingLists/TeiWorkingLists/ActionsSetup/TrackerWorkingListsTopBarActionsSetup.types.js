// @flow
import type { TrackerWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';

type ExtractedProps = $ReadOnly<{|
    onOpenBulkDataEntryPlugin: (trackedEntityIds: Array<string>) => void,
|}>;

type RestProps = $Rest<TrackerWorkingListsViewMenuSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type TrackerWorkingListsTopBarActionsSetupOutputProps = {|
    ...RestProps,
    ...ExtractedProps,
|};
