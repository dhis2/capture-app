// @flow
import type { EventProgram } from '../../../../../metaData';
import type { EventWorkingListsUpdateTriggerOutputProps } from '../UpdateTrigger';
import type { EventWorkingListsTemplates } from '../types';

type ExtractedProps = $ReadOnly<{|
    program: EventProgram,
    templates?: EventWorkingListsTemplates,
|}>;

type RestProps = $Rest<EventWorkingListsUpdateTriggerOutputProps, ExtractedProps>;

export type Props = $ReadOnly<{|
    ...RestProps,
    ...ExtractedProps,
|}>;
