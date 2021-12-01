// @flow
import type { CustomRowMenuContents } from '../../WorkingListsBase';
import type { EventWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';

type ExtractedProps = $ReadOnly<{|
    onDeleteEvent: Function,
    classes: Object,
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
