// @flow
import type { Stage, StageCommonProps } from '../../types/common.types';

type ExtractedProps = {|
    programId: string,
    stage: Stage,
    events: Array<ApiEnrollmentEvent>,
    className?: string,
    onEventClick: (eventId: string) => void,
    onDeleteEvent: (eventId: string) => void,
    onUpdateEventStatus: (eventId: string, status: string) => void,
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps
|}
