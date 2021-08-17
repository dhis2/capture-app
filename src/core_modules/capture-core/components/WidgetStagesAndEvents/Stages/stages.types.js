// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { Stage, StageCommonProps } from '../types/common.types';

 type ExtractedProps = {|
    stages: Array<Stage>,
    events: Array<ApiTEIEvent>,
    onEventClick: (eventId: string, stageId: string) => void,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps
|}
