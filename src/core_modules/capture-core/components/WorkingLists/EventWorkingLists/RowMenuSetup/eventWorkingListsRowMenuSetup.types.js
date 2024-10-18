// @flow
import type { EventWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';
import type { CustomRowMenuContents } from '../../WorkingListsBase';

type ExtractedProps = $ReadOnly<{|
    onDeleteEvent: Function,
|}>;

type RestProps = $Rest<EventWorkingListsViewMenuSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsRowMenuSetupOutputProps = {|
    ...RestProps,
    customRowMenuContents: CustomRowMenuContents,
|};
