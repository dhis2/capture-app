// @flow
import type { Stage, StageCommonProps } from '../../types/common.types';

type ExtractedProps = {|
    stage: Stage,
    events: Array<ApiEnrollmentEvent>,
    className?: string,
    onEventClick: (eventId: string) => void,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps
|}
