// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { Stage, StageCommonProps } from '../../types/common.types';

type ExtractedProps = {|
    stage: Stage,
    events: Array<ApiTEIEvent>,
    className?: string,
    onEventClick: (eventId: string, stageId: string) => void,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps
|}
