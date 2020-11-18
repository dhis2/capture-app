// @flow
import type { EventWorkingListsViewMenuSetupOutputProps } from '../ViewMenuSetup';
import type { CustomRowMenuContents } from '../../WorkingLists';

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
