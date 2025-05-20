// @flow
import type { TrackerWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';

type ExtractedProps = $ReadOnly<{|
    onOpenBulkDataEntryPlugin: (trackedEntities: Array<string>) => void,
|}>;

type RestProps = $Rest<TrackerWorkingListsViewMenuSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type TrackerWorkingListsActionsSetupOutputProps = {|
    ...RestProps,
    ...ExtractedProps,
|};
