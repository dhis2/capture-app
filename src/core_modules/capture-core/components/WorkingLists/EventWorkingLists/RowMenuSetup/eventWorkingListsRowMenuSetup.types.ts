import type { EventWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';
import type { CustomRowMenuContents } from '../../WorkingListsBase';

type ExtractedProps = {
    onDeleteEvent: (eventId: string) => void,
    stageId?: string,
};

type RestProps = Omit<EventWorkingListsViewMenuSetupOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type EventWorkingListsRowMenuSetupOutputProps = RestProps & {
    customRowMenuContents: CustomRowMenuContents,
};
