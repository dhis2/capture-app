import type { EventWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';
import type { CustomRowMenuContents } from '../../WorkingListsBase';

type ExtractedProps = {
    onDeleteEvent: any,
};

type RestProps = Omit<EventWorkingListsViewMenuSetupOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type EventWorkingListsRowMenuSetupOutputProps = RestProps & {
    customRowMenuContents: CustomRowMenuContents,
};
