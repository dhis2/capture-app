// @flow
import type { Stage, StageCommonProps } from '../types/common.types';

 type ExtractedProps = {|
    stages: Array<Stage>,
    events: ?Array<ApiEnrollmentEvent>,
    onEventClick: (eventId: string, stageId: string) => void,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps
|}
