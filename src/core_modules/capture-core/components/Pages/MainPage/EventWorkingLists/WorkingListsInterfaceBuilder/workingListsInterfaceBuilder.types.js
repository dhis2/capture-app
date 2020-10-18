// @flow
import type { EventProgram } from '../../../../../metaData';
import type { EventWorkingListsRowMenuSetupOutputProps } from '../RowMenuSetup';
import type { EventWorkingListsTemplates } from '../types';

type ExtractedProps = $ReadOnly<{|
    program: EventProgram,
    templates?: EventWorkingListsTemplates,
|}>;

type RestProps = $Rest<EventWorkingListsRowMenuSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};
