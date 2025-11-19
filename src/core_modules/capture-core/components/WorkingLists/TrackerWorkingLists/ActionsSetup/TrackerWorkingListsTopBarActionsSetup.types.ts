import type { TrackerWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';

type ExtractedProps = {
    onOpenBulkDataEntryPlugin?: (trackedEntityIds?: Array<string>) => void,
};

type RestProps = Omit<TrackerWorkingListsViewMenuSetupOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type TrackerWorkingListsTopBarActionsSetupOutputProps = RestProps & ExtractedProps;
