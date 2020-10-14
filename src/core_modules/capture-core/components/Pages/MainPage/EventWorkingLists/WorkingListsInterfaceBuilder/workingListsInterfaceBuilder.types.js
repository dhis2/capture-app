// @flow
import type { EventProgram } from '../../../../../metaData';
import type { EventWorkingListsRowMenuSetupOutputProps } from '../RowMenuSetup';

type ExtractedProps = $ReadOnly<{|
    program: EventProgram,
|}>;

type RestProps = $Rest<EventWorkingListsRowMenuSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};
